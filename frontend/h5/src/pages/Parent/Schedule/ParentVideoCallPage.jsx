import "/src/pages/Parent/ParentCss/ParentVideoCallPage.css";
import ButtonControlsVideo from "../../../components/OpenviduSession/ButtonControlsVideo";
import ParentvideoScreen from "../../../components/OpenviduSession/ParentVideoScreen";
import ConsultCounselorVideoScreen from "../../../components/OpenviduSession/ConsultCounselorVideoScreen";
import ScreenCounselorVideo from "../../../components/OpenviduSession/ShareCounselorVideo"
import { useState, useCallback } from "react";

function ParentVideoCallPage() {

  // 스트림
  const [session, setSession] = useState(null);
  const [subscribers, setSubscribers] = useState([]); // 상담사의 스트림
  const [publisher, setPublisher] = useState(null);

  // 상담사 스트림 구독
  const subscribeToStreamCreated = useCallback((session) => {
    session.on("streamCreated", (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    });
  }, []);

  // 상담사 스트림 제거
  const subscribeToStreamDestroyed = useCallback((session) => {
    session.on("streamDestroyed", (event) => {
      setSubscribers((prev) =>
        prev.filter((sub) => sub !== event.stream.streamManager)
      );
    });
  }, []);

  // 제어 함수

  const toggleVideo = useCallback(() => {
    console.log('Toggle Video Called');
    if (publisher) {
      console.log('Current Video State:', publisher.stream.videoActive);
      publisher.publishVideo(!publisher.stream.videoActive);
    }
  }, [publisher]);

  const toggleAudio = useCallback(() => {
    console.log('Toggle Audio Called');
    if (publisher) {
      console.log('Current Audio State:', publisher.stream.audioActive);
      publisher.publishAudio(!publisher.stream.audioActive);
    }
  }, [publisher]);

  const leaveSessionInternal = useCallback(() => {
    console.log('Toggle Audio Called');
    if (session) {
      session.disconnect();
    }
  }, [session]);

  return (
    <div className="pa-video-call-container">
      {/* 좌측 상단 로고 */}
      <img src="/logo.png" alt="로고" className="pa-logoo" />

      <div className="pa-video-layout">
        {/* 메인 비디오 */}
        <div className="pa-main-video">
          <ScreenCounselorVideo share subscribers={subscribers} />
        </div>

        {/* 참여자 비디오 */}
        <div className="pa-participant-videos">
          <div className="pa-participant">
            x
            <ParentvideoScreen
              session={session}
              setSession={setSession}
              setPublisher={setPublisher}
              onStreamCreated={subscribeToStreamCreated}
              onStreamDestroyed={subscribeToStreamDestroyed}
            />
          </div>
          <div className="pa-participant">
            <ConsultCounselorVideoScreen subscribers={subscribers} />
          </div>
        </div>
      </div>

      {/* 하단 컨트롤 버튼 */}
      <div className="pa-video-controls">
        <ButtonControlsVideo
          userType="parent"
          onVideoToggle={toggleVideo}
          onAudioToggle={toggleAudio}
          onEndCall={leaveSessionInternal}
        />
      </div>
    </div>
  );
}

export default ParentVideoCallPage;
