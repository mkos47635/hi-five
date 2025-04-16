import { useState, useEffect } from 'react';
import './MeetingCreateModal.css';
import SingleButtonAlert from '../common/SingleButtonAlert';
import TimeSlotSelector from './TimeSlotSelector';
import { searchChildByName } from "/src/api/schedule";
import { createSchedule, updateSchedule } from "/src/api/schedule";

const MeetingCreateModal = ({ onClose, isEdit = false, editData = null, onScheduleUpdate = () => {}, bookedSlots = [] }) => {
    const [searchTerm, setSearchTerm] = useState(editData?.counsultation_target || '');
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 저장
    const [childSelected, setChildSelected] = useState(false);

    // formData 초기값 설정
    const [formData, setFormData] = useState({
        scheduleId: editData?.scheduleId || '',
        childUserId: editData?.childUserId || '',
        childName: editData?.childName || '',
        email: editData?.parentEmail || '',
        parentName: editData?.parentName || '',
        type: editData?.counsultation_type === '게임' ? 'type1' : 
              editData?.counsultation_type === '아동학습현황상담' ? 'type2' : '',
        date: editData?.date || '',
        time: editData?.time || ''
    });

    useEffect(() => {
        if (editData?.childUserId) {
            console.log("🔍 초기 childUserId:", editData.childUserId);
        } else {
            console.log("⚠️ childUserId 없음");
        }
    }, [editData]); 

    useEffect(() => {
        if (editData) {
            console.log("📝 상담 수정 모달 열림 - 자동 입력할 데이터:", editData);
    
            setFormData({
                scheduleId: editData.scheduleId || '',
                childUserId: editData.childUserId || '',
                childName: editData.childName || '',
                type: editData.type === '게임' ? 'type1' : 'type2',
                date: editData.date || '',
                time: editData.time || '',
            });
            setSearchTerm(editData.childName);
        }
    }, [editData]); // editData 변경 시 자동 반영

    const handleChildSearch = (e) => {
        // 사용자가 다시 입력하면 선택 플래그 초기화
        setChildSelected(false);
        setSearchTerm(e.target.value);
    };

    // 실시간 검색 (debounce 적용)
    useEffect(() => {
        if (childSelected) return;
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            searchChildByName(searchTerm)
                .then(result => {
                    if (result && Array.isArray(result)) {
                        const formattedResults = result.map(child => ({
                            id: child.childUserId,
                            image: child.childProfileUrl !== "Default Image" ? child.childProfileUrl : "/default-profile.png",
                            childName: child.childUserName,
                            parentName: child.parentUserName,
                            email: child.parentUserEmail
                        }));
                        setSearchResults(formattedResults);
                        setShowDropdown(true);
                    } else {
                        setSearchResults([]);
                    }
                })
                .catch(error => {
                    console.error("❌ 아동 검색 실패:", error);
                    setSearchResults([]);
                });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // 검색된 아이 선택 시 입력 필드 자동 채우기
    const handleSelectChild = (child) => {
        setChildSelected(true);
        setFormData((prev) => ({
            ...prev,
            childUserId: child.id,  // 🔹 아이 ID 저장
            childName: child.childName,
            parentUserId: child.parentUserId || null, // 🔹 학부모 ID 저장 (없을 수도 있음)
            parentName: child.parentName,
            email: child.email
        }));
        setShowDropdown(false);
        setSearchTerm(child.childName);
    };

    // 상담 일정 생성/수정 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            if (!formData.childUserId || !formData.date || !formData.time) {
                console.log(formData);
                await SingleButtonAlert("필수 입력값을 모두 입력해주세요.");
                return;
            }

            // ✅ 시간 범위에서 시작 시간만 추출하고, 초(`:00`)까지 추가
            const formattedDateTime = `${formData.date} ${formData.time.split('~')[0].trim()}:00`;

            const newSchedule = {
                childId: parseInt(formData.childUserId, 10), // 🔹 ID를 정수로 변환
                schdlDttm: formattedDateTime, // 🔹 올바른 날짜 형식 적용
                type: formData.type === 'type1' ? 'game' : 'consult',
            };

            const udSchedule = {
                scheduleId: parseInt(formData.scheduleId, 10),
                childId: parseInt(formData.childUserId, 10), // 🔹 ID를 정수로 변환
                schdlDttm: formattedDateTime, // 🔹 올바른 날짜 형식 적용
                type: formData.type === 'type1' ? 'game' : 'consult',
            };

            if (isEdit) {
                console.log("📌 서버에 전송할 데이터:", udSchedule);
                await updateSchedule(udSchedule.scheduleId, udSchedule.childId, udSchedule.schdlDttm, udSchedule.type);
                await SingleButtonAlert('상담이 수정되었습니다.');
            } else {
                console.log("📌 서버에 전송할 데이터:", newSchedule);
                await createSchedule(newSchedule.childId, newSchedule.schdlDttm, newSchedule.type);
                await SingleButtonAlert('상담 생성이 완료되었습니다.');
            }
            onClose();
        } catch (error) {
            console.log(error);
            await SingleButtonAlert('상담 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="co-m-overlay">
            <div className="co-m-content">
                <div className="co-m-header">
                    <h2>{isEdit ? '상담일정 수정' : '상담일정 생성'}</h2>
                    <button className="co-m-close" onClick={onClose}></button>
                </div>

                <form onSubmit={handleSubmit} className="co-m-form">
                    <div className="co-m-form-group">
                        <label>아동 이름</label>
                        <div className="co-m-search-container">
                            <div className="co-m-search-input">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleChildSearch}
                                    placeholder="아동 이름을 입력하세요"
                                />
                            </div>
                            {showDropdown && (
                                <div className="co-m-search-dropdown">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((result) => (
                                            <div
                                                key={result.id}
                                                className="co-m-search-item"
                                                onClick={() => handleSelectChild(result)}
                                            >
                                                <img src={result.image} alt={result.childName} className="co-m-search-item-image" />
                                                <div className="co-m-search-item-info">
                                                    <span>{result.childName}</span>
                                                    <span>{result.parentName}</span>
                                                    <span>{result.email}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="co-m-search-item">🔍 검색 결과 없음</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="co-m-form-group">
                        <label>이메일</label>
                        <input type="email" value={formData.email} disabled />
                    </div>

                    <div className="co-m-form-group">
                        <label>학부모 이름</label>
                        <input type="text" value={formData.parentName} disabled />
                    </div>

                    <div className="co-m-form-group">
                        <label>상담 유형</label>
                        <select 
                            name="type" 
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            disabled={isEdit}
                        >
                            <option value="">유형을 선택해주세요.</option>
                            <option value="type1">아동(게임)</option>
                            <option value="type2">학부모(아동학습현황)</option>
                        </select>
                    </div>

                    <div className="co-m-form-group">
                        <label>상담 날짜</label>
                        <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                    </div>

                    <div className="co-m-form-group">
                        <label>상담 시간</label>
                        <TimeSlotSelector selectedDate={formData.time} onTimeSelect={(time) => setFormData({ ...formData, time })} />
                    </div>

                    <div className="co-m-buttons">
                        <button type="button" className="co-m-cancel-btn" onClick={onClose}>
                            취소
                        </button>
                        <button type="submit" className="co-m-submit-btn" onClick={handleSubmit}>
                            {isEdit ? "수정하기" : "상담 생성"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MeetingCreateModal;
