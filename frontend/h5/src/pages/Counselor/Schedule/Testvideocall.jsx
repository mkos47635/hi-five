import { useState, useEffect, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import ConsultantCam from '../../../components/Counselor/CounselorCam.jsx';
import ScreenShareCam from '../../../components/Counselor/CounselorShareScreen.jsx';
import ParentVideoScreen from "../../../components/OpenviduSession/ParentVideoScreen.jsx";
import api from '../../../api/api.jsx';
import { useSearchParams } from 'react-router-dom';

function CounselorParentVideoCallPage() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const childId = searchParams.get('childId');

    const [session, setSession] = useState(null);
    const [consultantPublisher, setConsultantPublisher] = useState(null);
    const [screenPublisher, setScreenPublisher] = useState(null);
    const OV = useRef(new OpenVidu());

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
                // 🟢 1️⃣ 하나의 세션만 사용
                const sessionInstance = OV.current.initSession();
                await sessionInstance.connect(await getToken());

                // 💻 웹캠 퍼블리셔
                const camPublisher = OV.current.initPublisher(undefined, {
                    videoSource: undefined, // 기본 카메라
                    audioSource: true,
                    mirror: true,
                });
                sessionInstance.publish(camPublisher);
                setConsultantPublisher(camPublisher);
                console.log('📸 웹캠 퍼블리싱 완료');

                // 🕒 웹캠 퍼블리싱 후 약간의 딜레이
                await new Promise((resolve) => setTimeout(resolve, 500));

                // 🖥️ 화면 공유 퍼블리셔 (같은 세션에 추가)
                const screenPub = OV.current.initPublisher(undefined, {
                    videoSource: 'screen',
                    audioSource: false,
                    mirror: false,
                });

                screenPub.on('accessDenied', () => {
                    console.error('🛑 화면 공유 권한 거부됨');
                });

                sessionInstance.publish(screenPub);
                setScreenPublisher(screenPub);
                console.log('🖥️ 화면 공유 퍼블리싱 완료');

                // 세션 상태 저장
                setSession(sessionInstance);
            } catch (error) {
                console.error('❌ 세션 초기화 실패:', error);
            }
        }

        initializeSession();
    }, [type, childId]);

    return (
        <div className="consultation-page">
            <h2>상담사 웹캠</h2>
            <ConsultantCam session={session} publisher={consultantPublisher} />
            <h2>학부모 웹캠</h2>
            {/*여기*/}
            <h2>상담사 화면 공유</h2>
            <ScreenShareCam session={session} publisher={screenPublisher} />
        </div>
    );
}

export default CounselorParentVideoCallPage;
