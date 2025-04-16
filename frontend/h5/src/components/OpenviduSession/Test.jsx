import { OpenVidu } from "openvidu-browser";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

function OpenviduVideo() {
  // 웹캠방 관리
  const [session, setSession] = useState(null);
  // 비디오 오디오 관리
  const [publisher, setPublisher] = useState(null);
  // 참가자 관리
  const [subscribers, setSubscribers] = useState([]);

  // 유저 아이디
  // 그런데 아래와 같으면 아동은 뭐로 식별하지? 아동아이디 있음!
  // const [userId] = useState(current.id);
  console.log('세션 스토리지: ', sessionStorage)

 

  // 서버 주소
  const APPLICATION_SERVER_URL = "https://hi-five.openvidu/";
  // SecretKey
  // const OPENVIDU_SECRET = "rm";
 
  // DOM 참조를 위한 훅
  const videoRef = useRef(null);
  const OVRef = useRef(null);

  //1. 토큰 발급(openVidu 서버에서 생성)
  const getToken = useCallback(async () => {
    try {
      // 세션 ID 생성
      const MysessionId = `session_C205_${Date.now()}`;
      // 위 생성된 아이디로 OPenVidu  서버에 세션 생성 요청
      const sessionId = await createSession(MysessionId);
      // 위 생성된 아이디로 토큰 생성
      return await createToken(sessionId);
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  }, []);

  // 2. 세션 생성
  const createSession = async (sessionId) => {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}api/sessions`,
      { customSessionId: sessionId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SECRET}`)}`,
        },
      }
    );
    return response.data;
  };

  // 3. 토큰 생성 (다른 사용자가 세션에 입장시 )
  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
        Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SECRET}`)}`,
      }
    );
    return response.data;
  };

  // 4. 세션에 참가 + 연결(사용자)
  const joinSession = useCallback(async () => {
    // 위 import문과 다른 OpenVidu 아래는 클래스문!
    OVRef.current = new OpenVidu();
    
    console.log('Joining session:', OVRef.current);

    // 실제 화상방 생성
    // 화상 채팅 세션 초기화(연결, 영상송출, 수신신)
    const newSession = OVRef.current.initSession();
    setSession(newSession);

    // 이벤트처리(새로운 참가자가 들어왔을때, 나갔을때, 상태변경)
    subscribeToStreamCreated(newSession);
    subscribeToStreamDestroyed(newSession);
    subscribeToUserChanged(newSession);

    try {
      const token = await getToken();
      await session.connect(token, { clientData: userEmail });
      await connectWebCam();
    } catch (err) {
      console.err("Error getting token:", err);
      if (err) {
        console.err({
          error: err.error,
          message: err.message,
          code: err.code,
          status: err.status,
        });
      }
    }
  }, [getToken, session]);



  // 5. 장치 연결
  const connectWebCam = async (currentSession) => {
    const publisher = await OVRef.current.initPublisherAsync(undefined, {
      audioSource: undefined,
      videoSource: undefined,           // undefined : 기본 카메라
      publishAudio: true,               // 오디오 시작 상태(true: 켜짐)
      publishVideo: true,               // 비디오 시작 상태(true: 켜짐)
      resolution: "640x480",            // 비디오 해상도
      frameRate: 30,                    // 초당 프레임 수
      insertMode: "APPEND",             // 비디오 요소에 돔을 추가하는 방식식
      mirror: false,                     // 좌우반전전
    });

    if (session){
      currentSession.publish(publisher);
      setPublisher(publisher);
    }
  };

  // 이벤트 리스너 함수
  // 새로운 참가자 스트림 구독
  const subscribeToStreamCreated = useCallback((session) => {
    session.on('streamCreated', (event) => {
        const subscriber = session.subscribe(event.stream, videoRef.current);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);

        console.log('비디오켜짐', event.stream.videoActive)
        console.log('오디오 켜짐', event.stream.audioActive)
        console.log('스트림 ID', event.stream.streamId)
    });
  }, []);

  // 참가자 나갔을 때 처리
const subscribeToStreamDestroyed = useCallback((session) => {
  session.on('streamDestroyed', (event) => {
      setSubscribers((prevSubscribers) => 
          prevSubscribers.filter(sub => sub !== event.stream.streamManager)
      );
  });
}, []);

  // 사용자 상태 변경 처리
  const subscribeToUserChanged = useCallback((session) => {
    session.on('signal:userChanged', (event) => {
        console.log("User changed:", event.data);
    });
  }, []);

  // 컨트롤 기능
  // 비디오 ON/OFF
  const toggleVideo = useCallback(() => {
    publisher?.publishVideo(!publisher.stream.videoActive);
  }, [publisher]);

  // 오디오 ON/OFF
  const toggleAudio = useCallback(() => {
    publisher?.publishAudio(!publisher.stream.audioActive);
  }, [publisher]);

  // 세션 종료
   const leaveSessionInternal = useCallback(() => {
      if (session) {
        session.disconnect();
      }
  
      OVRef.current = null;
      setSession(null);
      setSubscribers([]);
    }, [session]);
  
    // ... (Other functions like updateSubscribers, camStatusChanged, etc. would be converted similarly)
    // 공유기능
    
    const updateLayout = useCallback(() => {
      setTimeout(() => {
        layoutRef.current.updateLayout();
      }, 20);
    }, []);
  


  // 5. 연
  // 세션 마이크가 실행될때마다 처리
  useEffect(() => {

    joinSession();

    // 클린업함수 (메모리 누수 방지, 카메라 마이크 계속 켜있는 것 방지)
    // 클린업 함수
    return () => {
      if (session) {
        session.disconnect();
      }
      setSubscribers([]);
      if (publisher) {
        publisher.stream.dispose();
      }
    };
  }, [joinSession, session, publisher]);
    
    
  

  return (
  <div className="webcam-container">
    <div className="webcam-video" ref={videoRef}>
      {/* 종료, 공유중지,시작,비디오끄기,켜기,음성끄기켜기 */}
      <div className="control-buttons">
        <button onClick={toggleAudio} className="control-button-video">음성</button>
        <button onClick={toggleVideo} className="control-button-audio">화면</button>
        <button onClick={leaveSessionInternal}className="control-button-stop">떠나기기</button>
      </div>
    </div>
  </div>
  );
}
export default OpenviduVideo;
