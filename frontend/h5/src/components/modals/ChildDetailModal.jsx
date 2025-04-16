import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ChildDetailModal.css'
import DoubleButtonAlert from '../common/DoubleButtonAlert';
import SingleButtonAlert from '../common/SingleButtonAlert';
import ProfileImageModal from './ProfileImageModal';
import { approveDeleteRequest, rejectDeleteRequest, modifyConsultantChild } from "/src/api/userCounselor"; // ✅ API 호출 추가
import { uploadFile, getFileUrl, TBL_TYPES } from '../../api/file';
import defaultImg from '/child/character/angrymi.png';  // 기본 이미지 import


const ChildDetailModal = ({ isOpen, onClose, initialChildData, onDelete, onUpdate, onCancelRequest, isDeleteRequest  }) => {
    const [childData, setChildData] = useState(initialChildData);
    const [profileImage, setProfileImage] = useState(childData.imageUrl);
    const [isEditing, setIsEditing] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editedData, setEditedData] = useState({
        interests: childData.interests,
        notes: childData.notes,
        imageUrl: childData.imageUrl
    });
    const [editingField, setEditingField] = useState(null);
    // 이미지 파일 상태 추가
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    // 전화번호 포맷팅 함수 추가 (컴포넌트 내부, 최상단에 추가)
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return '';

        // 숫자만 추출
        const numbers = phoneNumber.replace(/[^\d]/g, '');

        // 11자리 전화번호 형식으로 변환
        if (numbers.length === 11) {
            return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }

        // 10자리 전화번호 형식으로 변환
        if (numbers.length === 10) {
            return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }

        // 그 외의 경우 원본 반환
        return phoneNumber;
    };


    const firstConsultDate = new Date(childData.firstConsultDate);
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
            interests: childData.interests,
            notes: childData.notes,
            imageUrl: childData.imageUrl
        });
        setProfileImage(childData.imageUrl);
    }, [childData]);

// ✅ 탈퇴 요청 승인 버튼 이벤트
    const handleApproveDelete = async () => {
        try {
            const result = await DoubleButtonAlert("정말 탈퇴 요청을 승인하시겠습니까?");
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    await approveDeleteRequest(childData.deleteUserRequestId);
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

// ✅ 탈퇴 요청 승인 버튼 이벤트
    const handleRejectDelete = async () => {
        try {
            const result = await DoubleButtonAlert("정말 탈퇴 요청을 거절하시겠습니까?");
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    await rejectDeleteRequest(childData.deleteUserRequestId);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setIsLoading(false);
                    const alertResult = await SingleButtonAlert("회원 탈퇴가가 거절되었습니다.");
                    if (alertResult.isConfirmed) {
                        onClose();
                    }
                } catch (error) {
                    console.error("❌ 탈퇴 거절절 중 오류 발생:", error);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setIsLoading(false);
                    const alertResult = await SingleButtonAlert("탈퇴 거절절 중 오류가 발생했습니다.");
                    if (alertResult.isConfirmed) {
                        onClose();
                    }
                }
            }
        } catch (error) {
            console.error("❌ 탈퇴 거절절 중 오류 발생:", error);
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoading(false);
            const alertResult = await SingleButtonAlert("탈퇴 거절절 중 오류가 발생했습니다.");
            if (alertResult.isConfirmed) {
                onClose();
            }
        }
    };


    const handleProfileEdit = () => {
        setIsProfileModalOpen(true);
    };

    // ProfileImageModal에서 이미지가 선택됐을 때 호출되는 함수
    const handleImageChange = async (newImage, imageFile) => {
        console.log('새로 선택된 이미지 파일:', imageFile); // 디버깅용
        console.log('새로 선택된 이미지 URL:', newImage); // 디버깅용
        setProfileImage(newImage); // 미리보기용 URL 설정
        setSelectedImageFile(imageFile); // 실제 파일 객체 저장
    };

    // 수정 완료 버튼 클릭 시 실행되는 함수
    const handleSaveClick = async () => {
        try {
            let newImageUrl = profileImage;
            if (selectedImageFile) {
                try {
                    // 파일 업로드
                    await uploadFile(
                        [selectedImageFile],
                        [TBL_TYPES.PROFILE_CHILD],
                        [String(childData.id)]
                    );

                    // 이미지 업로드 후 잠시 대기 (서버 처리 시간 고려)
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // 업데이트된 전체 데이터를 부모 컴포넌트에 전달
                    onUpdate(childData.id, {
                        ...childData,
                        interests: editedData.interests,
                        notes: editedData.notes
                    });

                } catch (error) {
                    console.error("이미지 업로드 실패:", error);
                    await SingleButtonAlert("이미지 업로드 중 오류가 발생했습니다.");
                    return;
                }
            }

            // 나머지 데이터 업데이트...
            await modifyConsultantChild(childData.id, editedData.interests, editedData.notes);

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
    // JSX에서:
    <img
        src={profileImage || defaultImg}
        alt="프로필 사진"
        onError={handleImageError}
    />

    const handleClose = () => {
        setIsEditing(false);
        setEditingField(null);
        onClose();
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleFieldEdit = (field) => {
        setEditingField(field);
    };

    const handleFieldChange = (field, value) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isOpen) return null;

    const modalContent = (
        <>
            <div className="modal-overlay">
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2><span>{childData.name}</span>님의 상세정보</h2>
                        <button className="close-button" onClick={handleClose}>×</button>
                    </div>

                    <div className="modal-body">
                        <div className="profile-section">
                            <div className='profile-image-container'>
                                <div className="profile-image">
                                    <img src={profileImage} alt="프로필 사진" />
                                </div>
                                {isEditing ? <div className="edit-img" onClick={handleProfileEdit}>수정</div> : <div className="edit-img"></div>}
                            </div>

                            {isProfileModalOpen && (
                                <ProfileImageModal onClose={() => setIsProfileModalOpen(false)} onImageChange={handleImageChange} initialImage={profileImage} />
                            )}

                            <div className="info-grid">
                                <div className="info-row">
                                    <span className="label">성별</span>
                                    <span className="value">{childData.gender}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">나이</span>
                                    <span className="value">{childData.age}세</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">부모님 성함</span>
                                    <span className="value">{childData.parentName}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">생년월일</span>
                                    <span className="value">{childData.birthDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="contact-info">
                            <div className="info-row">
                                <span className="label">부모님 연락처</span>
                                <span className="value">{formatPhoneNumber(childData.parentPhone)}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">부모님 이메일</span>
                                <span className="value">{childData.parentEmail}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">치료기간</span>
                                <span className="value">{diffMonths}개월 ({childData.firstConsultDate} ~ {today.toISOString().split('T')[0]})</span>
                            </div>
                            <div className="info-row">
                                <span className="label">센터 첫 상담 날짜</span>
                                <span className="value">{childData.firstConsultDate}</span>
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
                                                    onChange={(e) => handleFieldChange('interests', e.target.value)}
                                                    className="edit-input"
                                                />
                                                <button onClick={() => setEditingField(null)} className="save-btn">저장</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="value">{editedData.interests}</span>
                                                <button onClick={() => handleFieldEdit('interests')} className="edit-text">수정</button>
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
                                                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                                                    className="edit-input"
                                                />
                                                <button onClick={() => setEditingField(null)} className="save-btn">저장</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="value">{editedData.notes}</span>
                                                <button onClick={() => handleFieldEdit('notes')} className="edit-text">수정</button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <span className="value">{editedData.notes}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        {!isEditing ? (
                            <div>
                                {isDeleteRequest ? (
                                    <>
                                        <button
                                            className="btn-delete1"
                                            onClick={handleRejectDelete} // ✅ 거절 API 연결
                                        >
                                            <strong>요청거절</strong>
                                        </button>
                                        <button
                                            className="btn-delete2"
                                            onClick={handleApproveDelete} // ✅ 승인 API 연결
                                            disabled={isLoading}
                                        >
                                            <strong>{isLoading ? '처리 중...' : '요청 승인'}</strong>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn-submit" onClick={handleEditClick}>
                                            <strong>수정</strong>
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

    return ReactDOM.createPortal(
        modalContent,
        document.body
    );
};

export default ChildDetailModal;