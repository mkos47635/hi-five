import { useState, useEffect, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { useSearchParams } from 'react-router-dom';
import api from '../../../api/api.jsx';

function VideoPlayer({ stream }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            // publisher와 subscriber 모두 stream.stream에 실제 MediaStream이 있음
            videoRef.current.srcObject = stream.stream.getMediaStream();
        }
    }, [stream]);

    return <video autoPlay playsInline ref={videoRef} style={{ width: '100%' }} />;
}

function CounselorParentVideoCallPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const childId = searchParams.get('childId');
    const role = searchParams.get('role'); // 'consultant' 또는 'parent'

    const [session, setSession] = useState(null);
    // 로컬(내가 송출하는) 스트림들을 객체 형태로 관리
    const [localStreams, setLocalStreams] = useState({});
    // 원격(구독한) 스트림들을 객체 형태로 관리
    const [remoteStreams, setRemoteStreams] = useState({});
    const OV = useRef(new OpenVidu());

    async function getToken() {
        try {
            const response = await api.post('/session/join', { type, childId, role });
            return response.data;
        } catch (error) {
            console.error('❌ 토큰 요청 실패:', error);
            throw error;
        }
    }

    useEffect(() => {
        async function initializeSession() {
            try {
                const sessionInstance = OV.current.initSession();

                // 새 스트림이 생성될 때마다 stream의 data 값을 통해 스트림 타입을 확인하고 구독한 스트림으로 저장
                sessionInstance.on('streamCreated', (event) => {
                    let streamData;
                    try {
                        streamData = JSON.parse(event.stream.connection.data);
                    } catch (error) {
                        streamData = {};
                    }
                    const streamType = streamData.streamType; // ex: "consultant-cam", "consultant-screen", "parent-cam"
                    const subscriber = sessionInstance.subscribe(event.stream, undefined);
                    setRemoteStreams((prev) => ({ ...prev, [streamType]: subscriber }));
                });

                await sessionInstance.connect(await getToken());

                // 역할에 따라 로컬 송출 스트림 생성
                if (role === 'consultant') {
                    // 상담사: 자신의 웹캠과 화면공유를 송출
                    const camPublisher = OV.current.initPublisher(undefined, {
                        videoSource: undefined,
                        audioSource: true,
                        mirror: true,
                        data: JSON.stringify({ streamType: 'consultant-cam' }),
                    });
                    sessionInstance.publish(camPublisher);

                    const screenPublisher = OV.current.initPublisher(undefined, {
                        videoSource: 'screen',
                        audioSource: false,
                        mirror: false,
                        data: JSON.stringify({ streamType: 'consultant-screen' }),
                    });
                    sessionInstance.publish(screenPublisher);

                    setLocalStreams({
                        'consultant-cam': camPublisher,
                        'consultant-screen': screenPublisher,
                    });
                } else if (role === 'parent') {
                    // 학부모: 자신의 웹캠을 송출
                    const parentPublisher = OV.current.initPublisher(undefined, {
                        videoSource: undefined,
                        audioSource: true,
                        mirror: false,
                        data: JSON.stringify({ streamType: 'parent-cam' }),
                    });
                    sessionInstance.publish(parentPublisher);
                    setLocalStreams({
                        'parent-cam': parentPublisher,
                    });
                }

                setSession(sessionInstance);
            } catch (error) {
                console.error('❌ 세션 초기화 실패:', error);
            }
        }

        initializeSession();
        // type, childId, role가 변경될 때마다 세션을 초기화
    }, [type, childId, role]);

    return (
        <div className="consultation-page">
            {/* 상담사 웹캠 영역 */}
            <div className="video-container">
                <h2>상담사 웹캠</h2>
                {localStreams['consultant-cam'] ? (
                    <VideoPlayer stream={localStreams['consultant-cam']} />
                ) : remoteStreams['consultant-cam'] ? (
                    <VideoPlayer stream={remoteStreams['consultant-cam']} />
                ) : (
                    <p>영상 없음</p>
                )}
            </div>

            {/* 상담사 화면 공유 영역 */}
            <div className="video-container">
                <h2>상담사 화면 공유</h2>
                {localStreams['consultant-screen'] ? (
                    <VideoPlayer stream={localStreams['consultant-screen']} />
                ) : remoteStreams['consultant-screen'] ? (
                    <VideoPlayer stream={remoteStreams['consultant-screen']} />
                ) : (
                    <p>영상 없음</p>
                )}
            </div>

            {/* 학부모 웹캠 영역 */}
            <div className="video-container">
                <h2>학부모 웹캠</h2>
                {localStreams['parent-cam'] ? (
                    <VideoPlayer stream={localStreams['parent-cam']} />
                ) : remoteStreams['parent-cam'] ? (
                    <VideoPlayer stream={remoteStreams['parent-cam']} />
                ) : (
                    <p>영상 없음</p>
                )}
            </div>
        </div>
    );
}

export default CounselorParentVideoCallPage;
