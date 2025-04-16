// DeleteChildModal.jsx
import { useState, useEffect } from 'react';
import ChildDetailModal from './ChildDetailModal';
import { getParentDeleteRequests, getConsultantChild } from "/src/api/userCounselor";
import defaultImg from '/child/character/angrymi.png';  // 기본 이미지 import
import './DeleteChildModal.css';
import { getFileUrl, TBL_TYPES } from '../../api/file';
import ChildDeleteDetailModal from "./ChildDeleteDetailModal.jsx";

const DeleteChildModal = ({ isOpen, onClose, onDeleteRequestsChange }) => {
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailedRequestData, setDetailedRequestData] = useState(null); // { deleteUserRequestId, children: [...] }

  // ✅ 탈퇴 요청 리스트 불러오기
  useEffect(() => {
    if (isOpen) {
      fetchDeleteRequests();
    }
  }, [isOpen]);

  const fetchDeleteRequests = async () => {
    try {
      const data = await getParentDeleteRequests();
      setDeleteRequests(data);
      console.log("요청 데이터", data);
      onDeleteRequestsChange?.(data.length);
    } catch (error) {
      console.error("❌ 탈퇴 요청 리스트 불러오기 실패:", error);
    }
  };

  // 요청 클릭 시 해당 부모의 자식들 전체 상세 정보를 가져옴
  const handleRequestClick = async (request) => {
    try {
      // request.children는 이미 기본 자식 정보가 포함되어 있으나,
      // 추가 상세 정보(예: 프로필 이미지 URL 등)가 필요할 경우 각 자식별 API 호출 진행
      const childrenData = await Promise.all(
          request.children.map(async (child) => {
            const data = await getConsultantChild(child.childUserId);
            // 프로필 이미지 URL 가져오기
            const imageUrls = await getFileUrl(TBL_TYPES.PROFILE_CHILD, child.childUserId);
            let profileImageUrl = data.profileImgUrl;
            if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
              profileImageUrl = imageUrls[imageUrls.length - 1].url;
            }
            return {
              id: data.childUserId,
              name: data.childName,
              age: data.age,
              birthDate: data.birth,
              gender: data.gender,
              imageUrl: profileImageUrl || defaultImg,
              parentName: data.parentName,
              parentPhone: data.parentPhone,
              parentEmail: data.parentEmail,
              firstConsultDate: data.firstConsultDate,
              interests: data.interest,
              notes: data.additionalInfo,
            };
          })
      );
      setDetailedRequestData({
        deleteUserRequestId: request.deleteUserRequestId,
        children: childrenData,
      });
      setSelectedRequest(request);
    } catch (error) {
      console.error("❌ 아이 정보 불러오기 실패:", error);
    }
  };

  // 상세 모달 닫을 때 리스트 새로고침
  const handleCloseDetail = () => {
    setSelectedRequest(null);
    setDetailedRequestData(null);
    fetchDeleteRequests();
    onClose();
  };

  if (!isOpen) return null;

  return (
      <div className="delete-modal-overlay">
        <div className="delete-modal-content">
          <div className="delete-modal-header">
            <div className="header-title">탈퇴요청 리스트</div>
            <button className="delete-close-button" onClick={onClose}>×</button>
          </div>
          <div className="delete-modal-body">
            {deleteRequests.length === 0 ? (
                <div className="no-requests-message">들어온 요청이 없습니다.</div>
            ) : (
                <div className="delete-request-list">
                  <div className="delete-request-header">
                    <span>학부모 이름</span>
                    <span>아이 수</span>
                    <span>요청 날짜</span>
                  </div>
                  <div className="delete-request-scroll">
                    {deleteRequests.map((request) => (
                        <div
                            key={request.deleteUserRequestId}
                            className="delete-request-row"
                            onClick={() => handleRequestClick(request)}
                            style={{ cursor: "pointer" }}
                        >
                          <span>{request.parentName}</span>
                          <span>{request.children.length} 명</span>
                          <span>{request.deleteRequestDttm.slice(0,10)}</span>
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </div>

        {/* ✅ ChildDetailModal: 여러 자식 데이터를 전달 */}
        {selectedRequest && detailedRequestData && (
            <ChildDeleteDetailModal
                isOpen={true}
                onClose={handleCloseDetail}
                initialRequestData={detailedRequestData}
                isDeleteRequest={true}
            />
        )}
      </div>
  );
};

export default DeleteChildModal;
