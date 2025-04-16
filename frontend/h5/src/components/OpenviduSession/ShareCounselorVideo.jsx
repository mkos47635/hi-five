import { useEffect, useRef, useState } from 'react';

function ScreenCounselorVideo({ session }) {
    const [screenPublisher, setScreenPublisher] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const startScreenShare = async () => {
            if (!session) return;

            try {
                // OpenVidu를 사용한 화면 공유 시작
                const publisher = await session.createScreenShare();
                
                // 세션에 화면 공유 게시
                await session.publish(publisher);
                
                // 비디오 엘리먼트에 미디어 스트림 설정
                if (videoRef.current) {
                    const mediaStream = publisher.stream.getMediaStream();
                    videoRef.current.srcObject = mediaStream;
                }

                setScreenPublisher(publisher);
            } catch (error) {
                console.error('Screen share error:', error);
            }
        };

        // 세션이 존재할 때 화면 공유 시작
        if (session) {
            startScreenShare();
        }

        // 컴포넌트 언마운트 시 정리
        return () => {
            if (screenPublisher) {
                session.unpublish(screenPublisher);
            }
        };
    }, [session]);

    return (
        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: "300px", height: "200px" }} 
        />
    );
}

export default ScreenCounselorVideo;