import "./Css/CounselorCam.css"
import { useEffect, useRef } from 'react';

function CounselorCam({ publisher, mode }) {
    const videoRef = useRef(null);

    const setVideoStream = () => {
        if (publisher && videoRef.current) {
            const stream = publisher.stream ? publisher.stream.getMediaStream() : null;
            console.log('[CounselorCam] setVideoStream 호출, mode:', mode, 'publisher.stream:', publisher.stream);
            if (stream) {
                videoRef.current.srcObject = stream;
                videoRef.current.play()
                    .then(() => console.log('[CounselorCam] video 재생 시작'))
                    .catch(err => console.error('[CounselorCam] video play 에러:', err));
            } else {
                console.warn('[CounselorCam] publisher stream이 없습니다. 500ms 후 재확인합니다.');
                setTimeout(() => {
                    setVideoStream();
                }, 500);
            }
        }
    };

    useEffect(() => {
        console.log('[CounselorCam] useEffect 시작, publisher:', publisher, 'mode:', mode);
        setVideoStream();
        if (publisher) {
            console.log('[CounselorCam] streamPlaying 이벤트 리스너 등록');
            publisher.on('streamPlaying', setVideoStream);
        }
        return () => {
            if (publisher) {
                console.log('[CounselorCam] streamPlaying 이벤트 리스너 제거');
                publisher.off('streamPlaying', setVideoStream);
            }
        };
    }, [publisher, mode]);

    return (
        <div className="counselor-cam">
                <video ref={videoRef} autoPlay muted={mode === 'publish'} style={{ transform: 'scaleX(-1)' }} />
        </div>
    );
}

export default CounselorCam;
