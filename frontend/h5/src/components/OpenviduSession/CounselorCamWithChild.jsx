import { useEffect, useRef } from 'react';

function CounselorCamWithChild({ publisher, subscriber, mode }) {
    const videoRef = useRef(null);

    const setVideoStream = () => {
        let stream = null;
        // 상담사 페이지 (mode: publish)
        if (mode === 'publish' && publisher && publisher.stream) {
            stream = publisher.stream.getMediaStream();
        }
        // 아동 페이지 (mode: subscribe)
        else if (mode === 'subscribe' && subscriber && subscriber.stream) {
            stream = subscriber.stream.getMediaStream();
        }

        // console.log('[CounselorCam] stream:', stream);

        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play()
                .then(() => console.log('[CounselorCam] video 재생 시작'))
                .catch(err => console.error('[CounselorCam] video play 에러:', err));
        } else {
            // console.warn('[CounselorCam] stream이 없습니다. 500ms 후 재확인합니다.');
            setTimeout(() => {
                setVideoStream();
            }, 500);
        }
    };

    useEffect(() => {
        console.log('[CounselorCam] useEffect 시작, mode:', mode, 'publisher:', publisher, 'subscriber:', subscriber);
        setVideoStream();

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [publisher, subscriber, mode]);

    return (
        <div className="counselor-cam">
            <video ref={videoRef} autoPlay muted={mode === 'publish'} />
        </div>
    );
}
export default CounselorCamWithChild;
