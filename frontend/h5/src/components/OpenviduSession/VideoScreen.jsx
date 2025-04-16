import api from "../../api/api";
import { OpenVidu } from "openvidu-browser";
import { useEffect, useRef, useState, useCallback } from "react";

function OpenviduVideo() {
  // 상태 선언
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  //화면 공유 상태
  const [screenPublisher, setScreenPublisher] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);


  // ref 선언
  const videoRef = useRef(null);
  const OVRef = useRef(null);

  // 세션 스토리지에서 childId 가져오기
  const childId = sessionStorage.getItem("childId");
  console.log(childId);

  // ====================================================================
  // 1. 이벤트 리스너 함수들
  // ====================================================================

  // 새로운 참가자 스트림 구독
  const subscribeToStreamCreated = useCallback((session) => {
    session.on("streamCreated", (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    });
  }, []);

  // 참가자 스트림 제거
  const subscribeToStreamDestroyed = useCallback((session) => {
    session.on("streamDestroyed", (event) => {
      setSubscribers((prev) =>
        prev.filter((sub) => sub !== event.stream.streamManager)
      );
    });
  }, []);

  // 사용자 상태 변경 처리
  const subscribeToUserChanged = useCallback((session) => {
    session.on("signal:userChanged", (event) => {
      console.log("User changed:", event.data);
    });
  }, []);

  // ====================================================================
  // 2. 헬퍼 함수들
  // ====================================================================

  // 웹캠 연결 함수
  const connectWebCam = useCallback(async (currentSession) => {
    try {
      const publisher = await OVRef.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined, // 기본 카메라 사용
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      if (currentSession) {
        await currentSession.publish(publisher);
        setPublisher(publisher);
      }
    } catch (error) {
      console.error("웹캠 연결 오류:", error);
    }
  }, []);

  // 토큰 발급 함수
  // 타입을 이전페이지에서 넘겨줘야함! (버튼에서?)
  const getToken = useCallback(async () => {
    try {
      const requestData = {
        childId: Number(childId),
        type: "game",
      };

      const res = await api.post("/session/join", requestData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Sending request data:", res.data);

      // 응답 URL에서 token 추출
      const token = res.data

      if (!token) {
        throw new Error("토큰을 추출할 수 없습니다.");
      }
      return token;
    } catch (error) {
      console.error("토큰 에러:", error.message);
      console.error("토큰 에러 상세보기:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  }, [childId]);

  // 웹소켓 재연결 함수
  const connectWithRetry = async (session, token, maxAttempts = 3) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`연결 시도 ${attempt}/${maxAttempts}`);
        await session.connect(token, { clientData: String(childId) });
        console.log("연결 성공!");
        return true;
      } catch (error) {
        console.log(`연결 시도 ${attempt} 실패:`, error);

        if (attempt === maxAttempts) {
          alert("화상 연결에 실패했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.");
          throw error;
        }

        // 다음 시도 전 2초 대기
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  };

  // ====================================================================
  // 3. 세션 연결 및 관리 함수
  // ====================================================================

  // 세션 참가 및 연결 함수
  const joinSession = useCallback(async () => {
    try {
      // OpenVidu 인스턴스 생성
      OVRef.current = new OpenVidu();
      console.log("세션 들어가기:", OVRef.current);

      // 새로운 세션 생성
      const newSession = OVRef.current.initSession();

      // 이벤트 리스너 등록
      subscribeToStreamCreated(newSession);
      subscribeToStreamDestroyed(newSession);
      subscribeToUserChanged(newSession);

      // 세션 연결 끊김 시 재연결 처리
      newSession.on("sessionDisconnected", async (event) => {
        console.log("Session disconnected:", event.reason);
        if (event.reason === "networkDisconnect") {
          try {
            const token = await getToken();
            await connectWithRetry(newSession, token);
          } catch (error) {
            console.error("Reconnection failed after max attempts", error);
            setSession(null);
          }
        }
      });

      setSession(newSession);

      // 토큰으로 세션 연결 후 웹캠 연결
      const token = await getToken();
      await newSession.connect(token, { clientData: String(childId),
       });
      await connectWebCam(newSession);
    } catch (error) {
      console.error("Error in joinSession:", error);
      if (error) {
        console.error({
          error: error.error,
          message: error.message,
          code: error.code,
          status: error.status,
        });
      }
    }
  }, [
    childId,
    connectWebCam,
    getToken,
    subscribeToStreamCreated,
    subscribeToStreamDestroyed,
    subscribeToUserChanged,
  ]);

  // ====================================================================
  // 4. UI 제어 함수들
  // ====================================================================

  const toggleVideo = useCallback(() => {
    if (publisher) {
      publisher.publishVideo(!publisher.stream.videoActive);
      setIsVideoEnabled((prev) => !prev);
    }
  }, [publisher]);

  const toggleAudio = useCallback(() => {
    if (publisher) {
      publisher.publishAudio(!publisher.stream.audioActive);
      setIsAudioEnabled((prev) => !prev);
    }
  }, [publisher]);

  const leaveSessionInternal = useCallback(() => {
    if (session) {
      session.disconnect();
    }
    OVRef.current = null;
    setSession(null);
    setSubscribers([]);
  }, [session]);

  //화면 공유 기능
  //화면 공유 시작
  const startScreenShare = useCallback(async () => {
    if (!session || isScreenSharing) return;

    try {
      const screenPublisher = await OVRef.current.initPublisherAsync(undefined, {
        videoSource: "screen",
        publishAudio: true,  // 음성을 공유할지 선택
        publishVideo: true,
        mirror: false,
      });

      await session.publish(screenPublisher);
      setScreenPublisher(screenPublisher);
      setIsScreenSharing(true);

      screenPublisher.on("streamDestroyed", () => {
        stopScreenShare();
      });
    } catch (error) {
      console.error("화면 공유 시작 오류:", error);
    }
  }, [session, isScreenSharing]);

  //화면 중지 함수
  const stopScreenShare = useCallback(() => {
    if (screenPublisher) {
      screenPublisher.stream.dispose();
      session.unpublish(screenPublisher);
      setScreenPublisher(null);
      setIsScreenSharing(false);
    }
  }, [screenPublisher, session]);


  // ====================================================================
  // 5. 컴포넌트 라이프사이클 관리 (useEffect)
  // ====================================================================

  useEffect(() => {
    const connect = async () => {
      try {
        await joinSession();
      } catch (error) {
        console.error("Failed to join session:", error);
      }
    };

    if (!session) {
      connect();
    }

    return () => {
      setSubscribers([]);
      if (publisher) {
        try {
          const mediaStream = publisher.stream?.getMediaStream();
          if (mediaStream) {
            mediaStream.getTracks().forEach(track => {
              track.stop();
            });
          }
        } catch (error) {
          console.error('Error cleaning up stream:', error);
        }
      }
    };
  }, [session, joinSession, leaveSessionInternal, publisher]);


  useEffect(() => {
    if (publisher && videoRef.current) {
      try {
        const mediaStream = publisher.stream?.getMediaStream();

        console.log('Publisher:', publisher);
        console.log('MediaStream:', mediaStream);
        console.log('VideoRef:', videoRef.current);

        if (mediaStream) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error setting media stream:', error);
      }
    }
  }, [publisher]);


  // ====================================================================
  // 6. 렌더링
  // ====================================================================
  return (
    <div className="webcam-container">
      <div className="webcam-video">
       {/* 로컬 비디오 스트림을 위한 엘리먼트 */}
    {publisher && (
      <div className="local-video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="local-video"
        />
      </div>
    )}

    {/* 다른 참가자의 비디오 스트림 */}
    {subscribers.map((subscriber, index) => (
      <div key={index} className="remote-video-container">
        <video
          ref={(el) => {
            if (el) {
              subscriber.addVideoElement(el);
            }
          }}
          autoPlay
          playsInline
          className="remote-video"
        />
      </div>
    ))}


        <div className="control-buttons">
          <button onClick={toggleAudio} className="control-button-audio">
            음성
          </button>
          <button onClick={toggleVideo} className="control-button-video">
            화면
          </button>
          <button onClick={leaveSessionInternal} className="control-button-stop">
            떠나기
          </button>
        </div>
      </div>
    </div>
  );
}

export default OpenviduVideo;
