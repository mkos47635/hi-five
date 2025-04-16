import CounselorHeader from "../../../components/Counselor/CounselorHeader";
import Footer from "../../../components/common/Footer";
import { useState, useEffect } from 'react';
import PasswordChangeModal from "../../../components/modals/PasswordChangeModal";
import '../Css/CounselorMyPage.css';
import { getCounselorMyPage } from "/src/api/userCounselor";

function CounselorMyPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [counselorData, setCounselorData] = useState(null);

    // 전화번호 형식 변환 함수 추가
    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getCounselorMyPage();
                if (data) {
                    setCounselorData(data);
                }
            } catch (error) {
                console.error("데이터 불러오기 실패", error);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <main className="co-my-container">
                <CounselorHeader />
                <div className="co_blankdefault" style={{ marginTop: '64.49px' }}></div>
                <div className="co-mypage-container">
                    <div className="co-mypage-content">
                        <div className="co-profile-section">
                            <div className="co-profile-left">
                                <div className="co-profile-image-container">
                                    <img 
                                        src={counselorData?.profileImgUrl || "/default-profile.png"} 
                                        alt="상담사 프로필" 
                                        className="co-profile-image"
                                    />
                                </div>
                                <button className="co-change-password-btn" onClick={() => setIsModalOpen(true)}>
                                    비밀번호 변경
                                </button>
                            </div>
                            <div className="co-profile-info">
                                <div className="co-info-group">
                                    <label>상담사 이름</label>
                                    <input 
                                        type="text" 
                                        value={counselorData?.name || ""} 
                                        readOnly 
                                        className="co-info-input"
                                    />
                                </div>
                                <div className="co-info-group">
                                    <label>핸드폰 번호</label>
                                    <input 
                                        type="text" 
                                        value={formatPhoneNumber(counselorData?.phone) || ""}
                                        readOnly 
                                        className="co-info-input"
                                    />
                                </div>
                                <div className="co-info-group">
                                    <label>이메일</label>
                                    <input 
                                        type="email" 
                                        value={counselorData?.email || ""} 
                                        readOnly 
                                        className="co-info-input"
                                    />
                                </div>
                                <div className="co-info-group">
                                    <label>소속기관명</label>
                                    <input 
                                        type="text" 
                                        value={counselorData?.centerName || ""} 
                                        readOnly 
                                        className="co-info-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
            <PasswordChangeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}

export default CounselorMyPage;
