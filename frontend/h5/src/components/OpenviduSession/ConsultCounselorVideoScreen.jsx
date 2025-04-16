import "/src/pages/Parent/ParentCss/ParentVideoCallPage.css";
import api from "../../api/api";
import { OpenVidu } from "openvidu-browser";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

function ConsultCounselorVideoScreen() {
  // 토큰 받을 때 사용할 Params
  const [searchParams] = useSearchParams();
  const childId = searchParams.get("childId");
  const type = searchParams.get("type") || "consult";

  // 상태 관리
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);

  const OVRef = useRef(null);
  const videoRef = useRef(null);

  // 토큰 받기
  const getToken = useCallback(async () => {
    try {
      const res = await api.post("/session/join", {
        childId: Number(childId),
        type: type,
      });
      return res.data;
    } catch (error) {
      console.error("Token error:", error);
      throw error;
    }
  }, [childId, type]);

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
          alert(
            "화상 연결에 실패했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요."
          );
          throw error;
        }

        // 다음 시도 전 2초 대기
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  };

  // 참가하기
  const joinSession = useCallback(async () => {
    try {
      OVRef.current = new OpenVidu();
      const newSession = OVRef.current.initSession();

      setSession(newSession);

      const token = await getToken();
      await connectWithRetry(newSession, token);
      await connectWebCam(newSession);
    } catch (error) {
      console.error("Join session error:", error);
    }
  }, [childId, getToken]);

  const connectWebCam = useCallback(async (currentSession) => {
    try {
      const publisher = await OVRef.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        mirror: false,
      });
      await currentSession.publish(publisher);
      setPublisher(publisher);
    } catch (error) {
      console.error("Webcam error:", error);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    if (publisher && videoRef.current) {
      try {
        const mediaStream = publisher.stream?.getMediaStream();
        if (mediaStream) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Error setting media stream:", error);
      }
    }
  }, [publisher]);

  // 세션 연결 및 정리(cleanup)
  useEffect(() => {
    if (!session) joinSession();

    return () => {
      if (publisher) {
        try {
          const mediaStream = publisher.stream?.getMediaStream();
          if (mediaStream) {
            mediaStream.getTracks().forEach((track) => {
              track.stop();
            });
          }
        } catch (error) {
          console.error("Error cleaning up stream:", error);
        }
      }
    };
  }, [session, joinSession, publisher]);
  return (
    <div className="pa-webcam-container">
      {publisher && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="pa-webcam-video"
          style={{ width: "300px", height: "200px" }}
        />
      )}
    </div>
  );
}

export default ConsultCounselorVideoScreen;
