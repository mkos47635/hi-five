import { useState, useEffect, useRef,useCallback } from 'react';
import { OpenVidu } from 'openvidu-browser';
import CounselorCam from '../../../components/Counselor/CounselorCam.jsx';
import ScreenShareCam from '../../../components/Counselor/CounselorShareScreen.jsx';
import api from '../../../api/api.jsx';
import { useSearchParams } from 'react-router-dom';
import "../Css/CounselorParentVideoCall.css"
import { FaVideo, FaMicrophone, FaPhoneSlash, FaMicrophoneSlash } from "react-icons/fa";
import {sendAlarm} from "../../../api/alarm.jsx";

function CounselorParentVideoCallPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const childId = searchParams.get('childId');
  const role = searchParams.get('role'); // "consultant" 또는 "parent"
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // 메인 세션 (카메라용)
  const [session, setSession] = useState(null);
  // 화면 공유용 별도 세션 (scrSession)
  const [screenSession, setScreenSession] = useState(null);
  const OV = useRef(new OpenVidu());

  // 내 퍼블리셔 (카메라)
  const [ownPublisher, setOwnPublisher] = useState(null);
  // 내 화면 공유 퍼블리셔 (상담사 전용)
  const [ownScreenPublisher, setOwnScreenPublisher] = useState(null);

  // 상대방의 스트림 (카메라, 화면 공유)
  const [remoteCam, setRemoteCam] = useState(null);
  const [remoteScreen, setRemoteScreen] = useState(null);


  /** 토큰 요청 함수 **/
  async function getToken() {
    try {
      const response = await api.post('/session/join', { type, childId });
      return response.data;
    } catch (error) {
      console.error('❌ 토큰 요청 실패:', error);
      throw error;
    }
  }

  useEffect(() => {
    async function initializeSession() {
      try {
        // 메인 세션 생성 (카메라 스트림용)
        const sessionInstance = OV.current.initSession();
        setSession(sessionInstance);

        // 메인 세션 streamCreated 이벤트 (카메라 전용) -----------------------
        sessionInstance.on('streamCreated', (event) => {
          console.log(
              '메인 세션 streamCreated:',
              event.stream.streamId,
              event.stream.videoType
          );

          try {
            // 수정사항: videoType 값이 'screen' 또는 'SCREEN' 인지 구분
            const videoType =
                (event.stream.videoType || event.stream.typeOfVideo || '').toLowerCase();

            // 화면 공유 스트림은 별도 screenSession에서 다룸 => 여기선 카메라만 구독
            if (videoType !== 'screen') {
              const sub = sessionInstance.subscribe(event.stream, undefined);
              setRemoteCam(sub);
              console.log('Remote camera subscribed (메인):', event.stream.streamId);
            }
          } catch (err) {
            console.error('메인 세션 subscribe 에러:', err);
          }
        });

        // 메인 세션 streamDestroyed 이벤트 -----------------------------------
        sessionInstance.on('streamDestroyed', (event) => {
          console.log('메인 세션 streamDestroyed:', event.stream.streamId);
          const videoType =
              (event.stream.videoType || event.stream.typeOfVideo || '').toLowerCase();

          if (videoType !== 'screen') {
            setRemoteCam(null);
          }
        });

        // 메인 세션 연결 ---------------------------------------------------
        const token = await getToken();
        await sessionInstance.connect(token);

        // -------------------------- 상담사 로직 -----------------------------
        if (role === 'consultant') {
          // 1) 상담사: 메인 세션에서 카메라 퍼블리셔 생성 및 publish
          const camPublisher = OV.current.initPublisher(undefined, {
            videoSource: undefined,
            audioSource: true,
            mirror: true,
          });
          await sessionInstance.publish(camPublisher);
          setOwnPublisher(camPublisher);
          console.log('Consultant camera published');

          // 2) 상담사: 별도의 screenSession 생성, 화면 공유 퍼블리셔
          const scrOV = new OpenVidu();
          const scrSession = scrOV.initSession();
          setScreenSession(scrSession);

          // 상담사 화면 공유: streamCreated -> 단순 로깅하거나 필요 시 별도 처리
          scrSession.on('streamCreated', (event) => {
            console.log(
                '상담사 scrSession streamCreated:',
                event.stream.streamId,
                event.stream.videoType
            );
            // 상담사는 본인 화면 공유만 publish -> 일반적으로 구독 불필요
            // (다만, 미리 확인하려면 subscribe 가능)
          });

          scrSession.on('streamDestroyed', (event) => {
            console.log(
                '상담사 scrSession streamDestroyed:',
                event.stream.streamId,
                event.stream.videoType
            );
          });

          // 화면 공유 세션 연결
          const scrToken = await getToken();
          await scrSession.connect(scrToken);

          const scrPublisher = scrOV.initPublisher(undefined, {
            videoSource: 'screen',
            audioSource: false,
            mirror: false,
          });
          scrPublisher.on('accessDenied', () => {
            console.error('Screen share access denied');
          });

          await scrSession.publish(scrPublisher);
          setOwnScreenPublisher(scrPublisher);
          console.log('Consultant screen share published');
        }
        // ------------------------- 학부모 로직 ------------------------------
        else {
          // 1) 학부모: 메인 세션에서 자신의 카메라 퍼블리셔 생성 및 publish
          const camPublisher = OV.current.initPublisher(undefined, {
            videoSource: undefined,
            audioSource: true,
            mirror: true,
          });
          await sessionInstance.publish(camPublisher);
          setOwnPublisher(camPublisher);
          console.log('Parent camera published');

          // 2) 학부모: 별도의 scrSession에 연결하여 상담사의 화면 공유 스트림 구독
          const scrOV = new OpenVidu();
          const scrSession = scrOV.initSession();
          setScreenSession(scrSession);

          scrSession.on('streamCreated', (event) => {
            console.log(
                '학부모 scrSession streamCreated:',
                event.stream.streamId,
                event.stream.videoType
            );
            try {
              // 수정사항: screen 스트림만 구독
              const videoType =
                  (event.stream.videoType || event.stream.typeOfVideo || '').toLowerCase();

              if (videoType === 'screen') {
                const sub = scrSession.subscribe(event.stream, undefined);
                setRemoteScreen(sub);
                console.log('Remote screen share subscribed (학부모):', event.stream.streamId);
              }
            } catch (err) {
              console.error('scrSession subscribe 에러 (학부모):', err);
            }
          });

          scrSession.on('streamDestroyed', (event) => {
            console.log(
                '학부모 scrSession streamDestroyed:',
                event.stream.streamId,
                event.stream.videoType
            );
            setRemoteScreen(null);
          });

          // 화면 공유 세션 연결
          const scrToken = await getToken();
          await scrSession.connect(scrToken);
        }
      } catch (error) {
        console.error('❌ 세션 초기화 실패:', error);
      }
    }

    initializeSession();
  }, [type, childId, role]);

  // -------------------- 버튼 ----------------------
  const toggleVideo = useCallback(() => {
    ownPublisher?.publishVideo(!ownPublisher.stream.videoActive);
  }, [ownPublisher]);

  // 오디오 ON/OFF
  const toggleAudio = useCallback(() => {
    ownPublisher?.publishAudio(!ownPublisher.stream.audioActive);
    setIsAudioEnabled(!isAudioEnabled);
  }, [ownPublisher]);

  // 세션 종료
  // ✅ 버튼 클릭 시 세션 종료

  const leaveSessionInternal = useCallback(() => {
    console.log("수신: 학습 종료");
  
    if (session) {
      session.disconnect();
      console.log("OpenVidu 세션 종료됨");
    }
  
    setSession(null); // session 상태 변경
    window.close();
  }, [session]);
 
  



  // **************************************************************************************************************** //
  // 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람
  const isOtherParticipantAbsent = () => {
    if (!session) {
      console.log("[isOtherParticipantAbsent] 세션이 아직 초기화되지 않았습니다.");
      return false; // 세션이 없으면 아직 판단할 수 없음
    }

    let childStreamExists = false;

    if (session.streams && typeof session.streams.forEach === "function") {
      session.streams.forEach((stream) => {
        if (stream.typeOfVideo === "VIDEO") {
          childStreamExists = true;
        }
      });
    } else {
      console.log("[isOtherParticipantAbsent] session.streams가 없거나 순회할 수 없습니다.");
    }

    if (!childStreamExists) {
      console.log("[isOtherParticipantAbsent] 상대방(아동의 화면 공유 스트림)이 세션에 존재하지 않습니다.");
    } else {
      console.log("[isOtherParticipantAbsent] 아동의 화면 공유 스트림이 확인되었습니다.");
    }

    return !childStreamExists;
  };

  useEffect(() => {
    const checkAbsence = async () => {
      if (isOtherParticipantAbsent()) {
        console.log("[checkAbsence] 상대방이 없습니다. 알람 전송 시작...");
        // 알람 전송에 필요한 데이터(alarmDto)를 구성합니다.

        let alarmDto;
        if (role === 'consultant') {
          alarmDto = {
            toUserId: Number(childId),
            senderRole: "ROLE_CONSULTANT",
            sessionType: type,
          };
        } else {
          alarmDto = {
            toUserId: Number(childId),
            senderRole: "ROLE_PARENT",
            sessionType: type,
          };
        }

        try {
          const response = await sendAlarm(alarmDto);
          console.log("[checkAbsence] 알람 전송 성공:", response);
        } catch (error) {
          console.error("[checkAbsence] 알람 전송 실패:", error);
        }
      }
    };

    // 5초마다 체크 (원하는 시간 간격으로 변경 가능)
    checkAbsence();
  }, [session, childId]);
  // 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람 알람
  // **************************************************************************************************************** //

  // -------------------- 렌더링 ----------------------
  if (role === 'consultant') {
    return (
        <div className="co-cp-consultation-page">
          <img src="/logo.png" alt="로고" className='co-logoo' />
          <div className='co-cp-video-layout'>
              {/* 3. 내 화면 공유 송출화면 (상담사) */}
                <div className='co-cp-main-video-container'>
                  {ownScreenPublisher ? (
                      <ScreenShareCam publisher={ownScreenPublisher} mode="publish"
                      className="co-cp-main-video" />
                  ) : (
                      <div className='co-error'>화면 공유 중 아님</div>
                  )}
                </div>
              <div className='co-cp-participant-videos'>
                {/* 1. 내 화상 송출화면 (상담사) */}
                <div className='co-cp-participant-container'>
                  <CounselorCam session={session} publisher={ownPublisher} mode="publish"
                   className='co-cp-participant' />
                   <h3>상담사</h3>
                </div>

                {/* 2. 상대방 화상 (학부모) 구독 화면 */}
                <div className='co-cp-participant-container'>
                  {remoteCam ? (
                      <CounselorCam session={session} publisher={remoteCam} mode="subscribe"
                      className='co-cp-participant'/>
                  ) : (
                      <div className='co-error'>상대방 화상 없음</div>
                  )}
                   <h3>학부모</h3>
                </div>
              </div>
          </div>
          <div className="web-cp-button-controls-container">
              <button className="web-cp-control-btn" onClick={toggleVideo} >
                <FaVideo />
              </button>
              <button className="web-cp-control-btn" onClick={toggleAudio}>
                {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
              </button>
              <button className="web-cp-control-btn end-call" onClick={leaveSessionInternal}>
                <FaPhoneSlash />
              </button>
          </div>
        </div>
    );
  } else {
    return (
        <div className="co-cp-consultation-page">
          <img src="/logo.png" alt="로고" className='co-logoo' />

        <div className='co-cp-video-layout'>
          {/* 3. 상대방 화면 공유 (상담사) 구독 화면 */}
          <div className='co-cp-main-video-container'>
            {remoteScreen ? (
                <ScreenShareCam publisher={remoteScreen} mode="subscribe"
                />
            ) : (
                <div className='co-error'>상담사 화면 공유 없음</div>
            )}
          </div>
            <div className='co-cp-participant-videos'>
              {/* 1. 내 화상 송출화면 (학부모) */}
              <div className='co-cp-participant-container'>
                <CounselorCam session={session} publisher={ownPublisher} mode="publish"
                className='co-cp-participant'
                />
                <h3>학부모</h3>
              </div>

              {/* 2. 상대방 화상 (상담사) 구독 화면 */}
              <div className='co-cp-participant-container'>
                {remoteCam ? (
                    <CounselorCam session={session} publisher={remoteCam} mode="subscribe"
                    className="co-cp-participant"/>
                ) : (
                    <div className='co-error'>상대방 화상 없음</div>
                )}
                <h3>상담사</h3>
              </div>
            </div>
        </div>
         <div className="web-cp-button-controls-container">
              <button className="web-cp-control-btn"onClick={toggleVideo} >
                <FaVideo />
              </button>
              <button className="web-cp-control-btn" onClick={toggleAudio}>
                {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
              </button>
              <button className="web-cp-control-btn end-call"onClick={leaveSessionInternal} >
                <FaPhoneSlash />
              </button>
          </div>
        </div>
    );
  }
}

export default CounselorParentVideoCallPage;
