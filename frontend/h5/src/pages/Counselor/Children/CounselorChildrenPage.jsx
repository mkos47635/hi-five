import { useState, useEffect } from "react";
import CounselorHeader from "../../../components/Counselor/CounselorHeader";
import Footer from "../../../components/common/Footer";
import CoChildCard from "../../../components/Counselor/CoChildCard";
import ChildRegistrationModal from "../../../components/modals/ChildRegistrationModal";
import DeleteChildModal from "../../../components/modals/DeleteChildModal";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { getConsultantChildren, getConsultantChild, getParentDeleteRequests } from "/src/api/userCounselor";
import { getFileUrl, TBL_TYPES } from "../../../api/file";
import '../Css/CounselorChildrenPage.css';

function CounselorChildrenPage() {
  const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [deleteRequestCount, setDeleteRequestCount] = useState(0);
  const [deleteRequests, setDeleteRequests] = useState([]); // ✅ 탈퇴 요청 리스트 상태 추가
  const [childrenData, setChildrenData] = useState([]);
  const [searchType, setSearchType] = useState("child");
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 탈퇴 요청 리스트 불러오기
  async function fetchDeleteRequests() {
    try {
      const data = await getParentDeleteRequests();
      setDeleteRequests(data);
      setDeleteRequestCount(data.length);
    } catch (error) {
      console.error("❌ 탈퇴 요청 리스트 불러오기 실패:", error);
    }
  }

  // ✅ 아이 리스트 및 탈퇴 요청 리스트 동시 불러오기
async function fetchChildren() {
  try {
    const childrenList = await getConsultantChildren();
    const childrenDetailsPromises = childrenList.map(async child => {
      // 1. 아동 정보 가져오기
      const childDetails = await getConsultantChild(child.childUserID);
      
      try {
        // 2. 프로필 이미지 URL 가져오기
        const imageUrls = await getFileUrl(TBL_TYPES.PROFILE_CHILD, child.childUserID);
        console.log(`✅ 아동 ${child.childUserID}의 이미지 URL:`, imageUrls);

        // 3. imageUrls의 구조 확인 및 최신 이미지 URL 사용
        if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
          console.log('이미지 URLs:', imageUrls);
          // 배열의 마지막 항목(최신 이미지) 사용
          const latestImageUrl = imageUrls[imageUrls.length - 1].url;
          console.log('최신 이미지 URL:', latestImageUrl);
          
          return {
            ...childDetails,
            profileImageUrl: latestImageUrl
          };
        }
        
        return childDetails;
      } catch (error) {
        console.error(`❌ 아동 ${child.childUserID}의 프로필 이미지 URL 조회 실패:`, error);
        return childDetails;
      }
    });

    const childrenDetails = await Promise.all(childrenDetailsPromises);
    setChildrenData(childrenDetails);

    // 탈퇴 요청 리스트도 같이 불러옴
    fetchDeleteRequests();
  } catch (error) {
    console.error("아동 정보 불러오기 실패:", error);
  }
}

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleNotificationClick = () => {
    setIsDeleteListModalOpen(true);
  };

  const searchOptions = [
    { label: "아동 이름", value: "child" },
    { label: "학부모 이름", value: "parent" },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    fetchChildren();
    setIsModalOpen(false);
  };

  const handleUpdateChild = async (childId, updatedData) => {
    try {
      // 이미지 URL을 포함한 전체 데이터를 다시 가져오기
      const updatedChildDetails = await getConsultantChild(childId);
      const imageUrls = await getFileUrl(TBL_TYPES.PROFILE_CHILD, childId);
      
      let finalData = { ...updatedChildDetails };
      
      if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
        finalData.profileImageUrl = imageUrls[imageUrls.length - 1].url;
      }
  
      setChildrenData((prevChildren) =>
        prevChildren.map((child) =>
          child.childUserId === childId ? finalData : child
        )
      );
    } catch (error) {
      console.error("Failed to update child:", error);
    }
  };

  useEffect(() => {
    console.log("isModalOpen:",isModalOpen);
  }, [isModalOpen, setIsModalOpen])


  const handleDelete = async (childId) => {
    try {
      setChildrenData((prevChildren) =>
        prevChildren.filter((child) => child.id !== childId)
      );
    } catch (error) {
      console.error("Failed to delete child:", error);
    }
  };

  const filteredChildren = childrenData.filter((child) => {
    const searchValue = searchType === "child" ? child.childName : child.parentName;
    return searchValue.includes(searchText);
  });

  return (
    <>
      <div className="co-counselor-container">
        <div className="co-cc-fixed-section">
          <CounselorHeader />
          <div className="co_blankdefault" style={{ marginTop: "64.49px" }}></div>
          <div className="co-c-title">우리아동 한눈보기</div>
          <div className="co-search-notification-container">
            <div className="co-search-notification-inner">
              <div className="co-notification" onClick={handleNotificationClick}>
                <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#FFF2E0',
                      border: '1px solid #FF9F1C',
                      borderRadius: '4px',
                      padding: '0.4rem 0.6rem',
                      cursor: 'pointer'
                    }}
                    onClick={handleNotificationClick}
                >
                  <i className="pi pi-bell" style={{ fontSize: '1.5rem', color: '#FF9F1C', marginRight: '0.3rem' }} />
                  <span style={{ fontSize: '0.9rem', color: '#FF9F1C', width:60 }}>탈퇴 요청</span>
                </button>
                <span className="co-notification-badge">{deleteRequestCount}</span>
              </div>
              <div className="co-search-section">
                <Dropdown value={searchType} onChange={(e) => setSearchType(e.value)} options={searchOptions} className="co-search-dropdown2" />
                <div className="co-c-search-container">
                  <i className="pi pi-search co-search-icon"></i>
                  <InputText
                    placeholder="이름을 입력하세요"
                    className="co-search-input2"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="content-section">
          <div className="counselor-children-container">
            {childrenData.length === 0 ? (
              <div className="no-results">등록된 아동이 없습니다.</div>
            ) : filteredChildren.length > 0 ? (
              <div className="grid-container">
                <SimpleBar style={{ width: "100%", height: "100%" }} autoHide={false} forceVisible="y">
                  <div className="counselor-children-grid">
                    {filteredChildren.map((child) => (
                      <div key={child.childUserId} className={`counselor-children-item ${filteredChildren.length === 1 ? "single-item" : ""}`}>
                        <CoChildCard
                          id={child.childUserId}
                          childName={child.childName}
                          age={child.age}
                          parentName={child.parentName}
                          imageUrl={child.profileImageUrl}
                          gender={child.gender}
                          birthDate={child.birth}
                          parentPhone={child.parentPhone}
                          parentEmail={child.parentEmail}
                          treatmentPeriod={child.treatmentPeriod}
                          firstConsultDate={child.firstConsultDate}
                          interests={child.interest}
                          notes={child.additionalInfo}
                          onDelete={handleDelete}
                          onUpdate={handleUpdateChild} // ✅ 업데이트 함수 전달
                        />
                      </div>
                    ))}
                  </div>
                </SimpleBar>
              </div>
            ) : (
              <div className="no-results">검색 결과가 없습니다.</div>
            )}
            <button className="co-register-button" onClick={openModal}>회원등록</button>
          </div>
        </main>

        <Footer />

        {isModalOpen && <ChildRegistrationModal onClose={closeModal} />}
        <DeleteChildModal 
          isOpen={isDeleteListModalOpen} 
          onClose={() => {
            setIsDeleteListModalOpen(false);
            fetchChildren(); // ✅ 모달 닫힐 때 fetchChildren 실행
          }} 
          deleteRequests={deleteRequests} 
        />

      </div>
    </>
  );
}

export default CounselorChildrenPage;
