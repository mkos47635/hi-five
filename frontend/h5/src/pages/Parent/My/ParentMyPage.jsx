import ParentHeader from "../../../components/Parent/ParentHeader";
import Footer from "../../../components/common/Footer";
import "/src/pages/Parent/ParentCss/ParentMyPage.css";
import PasswordChangeModal from "/src/components/modals/PasswordChangeModal";
import DoubleButtonAlert from "/src/components/common/DoubleButtonAlert";
import SingleButtonAlert from "/src/components/common/SingleButtonAlert";
import { useState, useEffect } from "react";
import { getParentMyPage, requestParentAccountDeletion } from "/src/api/userParent";

function ParentMyPage() {
  const [childrenData, setChildrenData] = useState([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [parentData, setParentData] = useState(null);
  const [counselorData, setCounselorData] = useState(null);
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getParentMyPage();
        if (data) {
          setChildrenData(data.myChildren);
          setParentData(data.myInfo);
          setCounselorData(data.consultantInfo);
        }
      } catch (error) {
        console.error("데이터 불러오기 실패", error);
      }
    }
    fetchData();
  }, []);

  const currentChild = childrenData[selectedChildIndex] || {};

  const handleDelete = async () => {
    const result = await DoubleButtonAlert("탈퇴 요청을 보내시겠습니까?");
    if (result.isConfirmed) {
        try {
            const response = await requestParentAccountDeletion();
            console.log("✅ 탈퇴 요청 성공:", response);
            if (response.duplicate) {
              await SingleButtonAlert("이미 탈퇴 요청한 계정입니다. <br> 상담사의 승인 혹은 거절을 기다리세요.");
            } else {
              await SingleButtonAlert("탈퇴 요청이 완료되었습니다.");
            }
        } catch (error) {
            console.error("❌ 탈퇴 요청 실패:", error);
            await SingleButtonAlert("탈퇴 요청 중 오류가 발생했습니다.");
        }
    }
};

// 전화번호 형식 변환 함수 추가
const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};


  return (
    <div>
      <div className="mypage">
        <ParentHeader />
        <div className="mypage-container">
          <div className="mypage-info-container">
            <div className="mypage-card">
              <h3>아이 정보</h3>
              <div className="mypage-child">
                <img src={currentChild.profileImgUrl} alt="아동 사진" className="child-profile" />
                <div className="child-info">
                  <p>
                    <b>이름</b>{" "}
                    <select
                      value={selectedChildIndex}
                      onChange={(e) => setSelectedChildIndex(Number(e.target.value))}
                    >
                      {childrenData.map((child, index) => (
                        <option key={child.chidId} value={index}>
                          {child.name}
                        </option>
                      ))}
                    </select>
                  </p>
                  <p>
                    <b>연령</b> {currentChild.age}세
                  </p>
                  <p>
                    <b>성별</b> {currentChild.gender}
                  </p>
                </div>
              </div>
            </div>

            <div className="mypage-card">
              <h3>학부모 정보</h3>
              <div className="mypage-info">
                <p>
                  <b>이름</b> {parentData?.name}
                </p>
                <p>
                  <b>휴대폰 번호</b> {formatPhoneNumber(parentData?.phone)}
                </p>
                <p>
                  <b>이메일</b> {parentData?.email}
                </p>
              </div>
            </div>

            <div className="mypage-card">
              <h3>상담사 정보</h3>
              <div className="mypage-info">
                <p>
                  <b>이름</b> {counselorData?.consultantName}
                </p>
                <p>
                  <b>휴대폰 번호</b> {formatPhoneNumber(counselorData?.consultantPhone)}
                </p>
                <p>
                  <b>이메일</b> {counselorData?.consultantEmail}
                </p>
                <p>
                  <b>상담기관명</b> {counselorData?.centerName}
                </p>
              </div>
            </div>
          </div>

          <div className="mypage-buttons">
            <button className="btn btn-primary" onClick={() => setIsPwdModalOpen(true)}>
              비밀번호 변경
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              회원 탈퇴
            </button>
          </div>
        </div>

        {isPwdModalOpen && <PasswordChangeModal isOpen={isPwdModalOpen} onClose={() => setIsPwdModalOpen(false)} role="parent"/>}
      </div>
      <Footer />
    </div>
  );
}

export default ParentMyPage;
