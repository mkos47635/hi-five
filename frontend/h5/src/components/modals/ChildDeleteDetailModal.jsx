// ChildDetailModal.jsx
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ChildDeleteDetailModal.css';
import DoubleButtonAlert from '../common/DoubleButtonAlert';
import SingleButtonAlert from '../common/SingleButtonAlert';
import ProfileImageModal from './ProfileImageModal';
import { approveDeleteRequest, rejectDeleteRequest, modifyConsultantChild } from "/src/api/userCounselor";
import { uploadFile, getFileUrl, TBL_TYPES } from '../../api/file';
import defaultImg from '/child/character/angrymi.png';

const ChildDetailModal = ({ isOpen, onClose, initialRequestData, isDeleteRequest }) => {
    // 초기 데이터가 없으면 렌더링하지 않음
    if (!initialRequestData || !initialRequestData.children || initialRequestData.children.length === 0) {
        return null;
    }

    // children 배열을 id 기준 오름차순으로 정렬하여 상태에 저장
    const sortedRequestData = {
        ...initialRequestData,
        children: [...initialRequestData.children].sort((a, b) => a.id - b.id),
    };

    const [requestData, setRequestData] = useState(sortedRequestData);
    const [currentChildIndex, setCurrentChildIndex] = useState(0);
    const currentChild = requestData.children[currentChildIndex];

    const [profileImage, setProfileImage] = useState(currentChild.imageUrl);
    const [isEditing, setIsEditing] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editedData, setEditedData] = useState({
        interests: currentChild.interests,
        notes: currentChild.notes,
        imageUrl: currentChild.imageUrl,
    });
    const [editingField, setEditingField] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    // 전화번호 포맷팅 함수
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return '';
        const numbers = phoneNumber.replace(/[^\d]/g, '');
        if (numbers.length === 11) {
            return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        if (numbers.length === 10) {
            return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        return phoneNumber;
    };

    const firstConsultDate = new Date(currentChild.firstConsultDate);
    const today = new Date();
    const diffTime = Math.abs(today - firstConsultDate);
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        setEditedData({
            interests: currentChild.interests,
            notes: currentChild.notes,
            imageUrl: currentChild.imageUrl,
        });
        setProfileImage(currentChild.imageUrl);
    }, [currentChild]);

    const handlePrev = () => {
        if (currentChildIndex > 0) setCurrentChildIndex(currentChildIndex - 1);
    };

    const handleNext = () => {
        if (currentChildIndex < requestData.children.length - 1)
            setCurrentChildIndex(currentChildIndex + 1);
    };

    const handleApproveDelete = async () => {
        try {
            const result = await DoubleButtonAlert("정말 탈퇴 요청을 승인하시겠습니까?");
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    await approveDeleteRequest(requestData.deleteUserRequestId);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setIsLoading(false);
                    const alertResult = await SingleButtonAlert("회원 탈퇴가 승인되었습니다.");
                    if (alertResult.isConfirmed) {
                        onClose();
                    }
                } catch (error) {
                    console.error("❌ 탈퇴 승인 중 오류 발생:", error);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setIsLoading(false);
                    const alertResult = await SingleButtonAlert("탈퇴 승인 중 오류가 발생했습니다.");
                    if (alertResult.isConfirmed) {
                        onClose();
                    }
                }
            }
        } catch (error) {
            console.error("❌ 탈퇴 승인 중 오류 발생:", error);
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoading(false);
            const alertResult = await SingleButtonAlert("탈퇴 승인 중 오류가 발생했습니다.");
            if (alertResult.isConfirmed) {
                onClose();
            }
        }
    };

    const handleRejectDelete = async () => {
        try {
            const result = await DoubleButtonAlert("정말 탈퇴 요청을 거절하시겠습니까?");
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    await rejectDeleteRequest(requestData.deleteUserRequestId);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setIsLoading(false);
                    const alertResult = await SingleButtonAlert("회원 탈퇴가 거절되었습니다.");
                    if (alertResult.isConfirmed) {
                        onClose();
                    }
                } catch (error) {
                    console.error("❌ 탈퇴 거절 중 오류 발생:", error);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setIsLoading(false);
                    const alertResult = await SingleButtonAlert("탈퇴 거절 중 오류가 발생했습니다.");
                    if (alertResult.isConfirmed) {
                        onClose();
                    }
                }
            }
        } catch (error) {
            console.error("❌ 탈퇴 거절 중 오류 발생:", error);
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoading(false);
            const alertResult = await SingleButtonAlert("탈퇴 거절 중 오류가 발생했습니다.");
            if (alertResult.isConfirmed) {
                onClose();
            }
        }
    };

    const handleProfileEdit = () => {
        setIsProfileModalOpen(true);
    };

    const handleImageChange = async (newImage, imageFile) => {
        console.log('새로 선택된 이미지 파일:', imageFile);
        console.log('새로 선택된 이미지 URL:', newImage);
        setProfileImage(newImage);
        setSelectedImageFile(imageFile);
    };

    const handleSaveClick = async () => {
        try {
            let newImageUrl = profileImage;
            if (selectedImageFile) {
                try {
                    await uploadFile(
                        [selectedImageFile],
                        [TBL_TYPES.PROFILE_CHILD],
                        [String(currentChild.id)]
                    );
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error("이미지 업로드 실패:", error);
                    await SingleButtonAlert("이미지 업로드 중 오류가 발생했습니다.");
                    return;
                }
            }
            await modifyConsultantChild(currentChild.id, editedData.interests, editedData.notes);
            setIsEditing(false);
            setEditingField(null);
            setSelectedImageFile(null);
            await SingleButtonAlert("회원 정보가 성공적으로 수정되었습니다.");
        } catch (error) {
            console.error("회원 정보 수정 실패:", error);
            await SingleButtonAlert("회원 정보 수정 중 오류가 발생했습니다.");
        }
    };

    const handleImageError = (e) => {
        e.target.src = defaultImg;
    };

    const handleClose = () => {
        setIsEditing(false);
        setEditingField(null);
        onClose();
    };

    const renderChildCard = () => (
        <div className="child-card">
            <div className="profile-section">
                <div className='profile-image-container'>
                    <div className="profile-image">
                        <img src={profileImage || defaultImg} alt="프로필 사진" onError={handleImageError} />
                    </div>
                    {isEditing ? <div className="edit-img" onClick={handleProfileEdit}>수정</div> : <div className="edit-img"></div>}
                </div>
                {isProfileModalOpen && (
                    <ProfileImageModal onClose={() => setIsProfileModalOpen(false)} onImageChange={handleImageChange} initialImage={profileImage} />
                )}
                <div className="info-grid">
                    <div className="info-row">
                        <span className="label">성별</span>
                        <span className="value">{currentChild.gender}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">나이</span>
                        <span className="value">{currentChild.age}세</span>
                    </div>
                    <div className="info-row">
                        <span className="label">부모님 성함</span>
                        <span className="value">{currentChild.parentName}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">생년월일</span>
                        <span className="value">{currentChild.birthDate}</span>
                    </div>
                </div>
            </div>

            <div className="contact-info">
                <div className="info-row">
                    <span className="label">부모님 연락처</span>
                    <span className="value">{formatPhoneNumber(currentChild.parentPhone)}</span>
                </div>
                <div className="info-row">
                    <span className="label">부모님 이메일</span>
                    <span className="value">{currentChild.parentEmail}</span>
                </div>
                <div className="info-row">
                    <span className="label">치료기간</span>
                    <span className="value">{diffMonths}개월 ({currentChild.firstConsultDate} ~ {today.toISOString().split('T')[0]})</span>
                </div>
                <div className="info-row">
                    <span className="label">센터 첫 상담 날짜</span>
                    <span className="value">{currentChild.firstConsultDate}</span>
                </div>
                <div className="info-row">
                    <span className="label">관심사</span>
                    {isEditing ? (
                        <div className="edit-value-container">
                            {editingField === 'interests' ? (
                                <div className="edit-input-container">
                                    <input
                                        type="text"
                                        value={editedData.interests}
                                        onChange={(e) => setEditedData(prev => ({ ...prev, interests: e.target.value }))}
                                        className="edit-input"
                                    />
                                    <button onClick={() => setEditingField(null)} className="save-btn">저장</button>
                                </div>
                            ) : (
                                <>
                                    <span className="value">{editedData.interests}</span>
                                    <button onClick={() => setEditingField('interests')} className="edit-text">수정</button>
                                </>
                            )}
                        </div>
                    ) : (
                        <span className="value">{editedData.interests}</span>
                    )}
                </div>
                <div className="info-row">
                    <span className="label">기타사항</span>
                    {isEditing ? (
                        <div className="edit-value-container">
                            {editingField === 'notes' ? (
                                <div className="edit-input-container">
                                    <input
                                        type="text"
                                        value={editedData.notes}
                                        onChange={(e) => setEditedData(prev => ({ ...prev, notes: e.target.value }))}
                                        className="edit-input"
                                    />
                                    <button onClick={() => setEditingField(null)} className="save-btn">저장</button>
                                </div>
                            ) : (
                                <>
                                    <span className="value">{editedData.notes}</span>
                                    <button onClick={() => setEditingField('notes')} className="edit-text">수정</button>
                                </>
                            )}
                        </div>
                    ) : (
                        <span className="value">{editedData.notes}</span>
                    )}
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    const modalContent = (
        <>
            <div className="modal-overlay">
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>
                            <span>{currentChild.name}</span>님의 상세정보
                            {requestData.children.length > 1 && (
                                <span className="child-index">
          ({currentChildIndex + 1} / {requestData.children.length})
        </span>
                            )}
                        </h2>
                        <button className="close-button" onClick={handleClose}>×</button>
                    </div>

                    <div className="modal-body" style={{ position: "relative" }}>
                        {renderChildCard()}

                        {/* 좌우 카로셀 버튼 */}
                        {requestData.children.length > 1 && (
                            <div className="carousel-controls">
                                <button
                                    className="carousel-button"
                                    onClick={handlePrev}
                                    disabled={currentChildIndex === 0}
                                >
                                    ◀
                                </button>
                                <button
                                    className="carousel-button"
                                    onClick={handleNext}
                                    disabled={currentChildIndex === requestData.children.length - 1}
                                >
                                    ▶
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        {!isEditing ? (
                            <div>
                                {isDeleteRequest ? (
                                    <>
                                        <button
                                            className="btn-delete1"
                                            onClick={handleRejectDelete}
                                        >
                                            <strong>요청거절</strong>
                                        </button>
                                        <button
                                            className="btn-delete2"
                                            onClick={handleApproveDelete}
                                            disabled={isLoading}
                                        >
                                            <strong>{isLoading ? '처리 중...' : '요청 승인'}</strong>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn-submit" onClick={() => setIsEditing(true)}>
                                            <strong>수정</strong>
                                        </button>
                                        <button
                                            className="btn-delete2"
                                            disabled={isLoading}
                                        >
                                            <strong>{isLoading ? '삭제 중...' : '회원삭제'}</strong>
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <button className="btn-submit" onClick={handleSaveClick}>
                                <strong>수정완료</strong>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {isLoading && (
                <div className="loading-overlay3">
                    <div className="loading-spinner3"></div>
                </div>
            )}
        </>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default ChildDetailModal;
