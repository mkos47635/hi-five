import CounselorHeader from "../../../components/Counselor/CounselorHeader";
import Footer from "../../../components/common/Footer";
import MeetingCreateModal from "../../../components/modals/MeetingCreateModal";
import DoubleButtonAlert from "../../../components/common/DoubleButtonAlert";
import SingleButtonAlert from "../../../components/common/SingleButtonAlert";
import { Calendar } from 'primereact/calendar';
import { useState, useEffect } from 'react';
import { addLocale } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import '../Css/CounselorSchedulePage.css';
import { searchChildByName, getConsultantScheduleList, getChildScheduleList, getChildScheduleDates, deleteSchedule } from '../../../api/schedule';

addLocale('ko', {
    firstDayOfWeek: 0,
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    today: '오늘',
    clear: '초기화',
    dateFormat: 'yy년 mm월',
    yearSuffix: '년'
});

function CounselorSchedulePage() {
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [date, setDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [schedules, setSchedules] = useState([]);
    // 추가: 사용자가 드롭다운에서 선택한 상태 여부
    const [childSelected, setChildSelected] = useState(false);

    // 날짜 셀 렌더링 (하이라이트 적용)
    const dateTemplate = (dateObj) => {
        const currentDate = dateObj.getFullYear
            ? dateObj
            : new Date(dateObj.year, dateObj.month, dateObj.day);

        const isHighlighted = highlightedDates.some(d =>
            d.getFullYear() === currentDate.getFullYear() &&
            d.getMonth() === currentDate.getMonth() &&
            d.getDate() === currentDate.getDate()
        );

        return (
            <div className={isHighlighted ? 'highlight-circle' : ''}>
                {currentDate.getDate()}
            </div>
        );
    };

    // 드롭다운에서 아동 선택 시 (child 객체 전체를 전달)
    const handleChildSelect = (child) => {
        setChildSelected(true);
        setSearchTerm(child.name);
        setSelectedChildId(child.id);
        setShowSuggestions(false);

        const fetchSchedulesChild = async () => {
            if (!child.id) return;
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            const response = await getChildScheduleList(child.id, year, month);
            console.log("응답이여 ~ : ", response);

            try {
                const dateResponse = await getChildScheduleDates(child.id, year, month);
                console.log("📅 특정 아동 상담 날짜: ", dateResponse);

                const formattedDates = dateResponse.map(dateString => {
                    const [year, month, day] = dateString.split('-').map(Number);
                    return new Date(year, month - 1, day);
                });
                setHighlightedDates(formattedDates);
            } catch (error) {
                console.error("❌ 특정 아동 상담 날짜 조회 실패", error);
                setHighlightedDates([]);
            }

            const formattedSchedules = response.map(item => {
                const [year, month, day, hour, minute] = item.schdlDttm;
                const dateTime = new Date(year, month - 1, day, hour, minute);
                return {
                    scheduleId: item.scheduleId,
                    childUserId : item.childUserId,
                    time: `${String(dateTime.getHours()).padStart(2, "0")}:00 ~ ${String(dateTime.getHours() + 1).padStart(2, "0")}:00`,
                    counselor: item.consultantName,
                    consultation_target: item.childName,
                    consultation_type: item.type === 'game' ? '게임' : '학부모 상담',
                    parentName: item.parentName,
                    parentEmail: item.parentEmail,
                    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    isLoading: false,
                    isCompleted: item.status === 'E'
                };
            });
            setSchedules(formattedSchedules);
        };

        fetchSchedulesChild();
    };

    // 검색창 입력 값 변경 시 (입력 시 선택 상태 초기화)
    const handleSearchChange = (e) => {
        setChildSelected(false);
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const fetchSchedules = async () => {
            if (!date) return;
            const formattedDate = formatDateToString(date);
            const response = await getConsultantScheduleList(formattedDate);
            const now = new Date();
            const formattedSchedules = response.map(item => {
                const [year, month, day, hour, minute] = item.schdlDttm;
                const dateTime = new Date(year, month - 1, day, hour, minute);
                return {
                    scheduleId: item.scheduleId,
                    childUserId : item.childUserId,
                    time: `${String(dateTime.getHours()).padStart(2, "0")}:00 ~ ${String(dateTime.getHours() + 1).padStart(2, "0")}:00`,
                    counselor: item.consultantName,
                    consultation_target: item.childName,
                    consultation_type: item.type === 'game' ? '게임' : '학부모 상담',
                    status: item.status,
                    parentName: item.parentName,
                    parentEmail: item.parentEmail,
                    date: formattedDate,
                    isLoading: false,
                    isCompleted: item.status === 'E' || new Date(dateTime.getTime() + 60 * 60 * 1000) < now
                };
            });
            setSchedules(formattedSchedules);
        };
        fetchSchedules();
    }, [date]);

    const formatDateToString = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateSelect = (e) => {
        setDate(e.value);
        setCurrentMonth(e.value);
    };

    const handleViewDateChange = (e) => {
        const newDate = e.value;
        setCurrentMonth(newDate);
        setDate(newDate);
    };

    const filteredSchedules = schedules.filter(schedule => {
        if (searchTerm) {
            const scheduleDate = new Date(schedule.date);
            const currentMonthDate = new Date(currentMonth);
            const isSameMonth =
                scheduleDate.getFullYear() === currentMonthDate.getFullYear() &&
                scheduleDate.getMonth() === currentMonthDate.getMonth();
            return schedule.consultation_target.toLowerCase().includes(searchTerm.toLowerCase())
                && isSameMonth;
        }
        const selectedDate = formatDateToString(date);
        return schedule.date === selectedDate;
    }).sort((a, b) => {
        if (a.date !== b.date) {
            return new Date(a.date) - new Date(b.date);
        }
        const timeA = a.time.split('~')[0].trim();
        const timeB = b.time.split('~')[0].trim();
        return timeA.localeCompare(timeB);
    });

    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const handleDelete = async (scheduleToDelete) => {
        try {
            const result = await DoubleButtonAlert('상담을 삭제하시겠습니까?');
            if (result.isConfirmed) {
                try {
                    const deleteType = scheduleToDelete.consultation_type === '게임' ? "game" : "consult";
                    const response = await deleteSchedule(scheduleToDelete.scheduleId, deleteType);
                    await SingleButtonAlert(response.message || "성공적으로 삭제되었습니다.");
                    setSchedules(prevSchedules =>
                        prevSchedules.filter(schedule => schedule.scheduleId !== scheduleToDelete.scheduleId)
                    );
                    handleModalClose();
                } catch (error) {
                    await SingleButtonAlert(
                        error.response?.data?.message || "상담 삭제 중 오류가 발생했습니다."
                    );
                }
            }
        } catch (error) {
            console.error('❌ 삭제 중 오류 발생:', error);
        }
    };

    const handleJoin = (index) => {
        const targetSchedule = filteredSchedules[index];
        setSchedules(prevSchedules => prevSchedules.map(schedule =>
            schedule.date === targetSchedule.date &&
            schedule.time === targetSchedule.time &&
            schedule.counsultation_target === targetSchedule.counsultation_target
                ? { ...schedule, isCompleted: true }
                : schedule
        ));
        const path = targetSchedule.consultation_type === "게임"
            ? `schedule/child-video-call?type=game&childId=${targetSchedule.childUserId}`
            : `schedule/parent-video-call?type=consult&childId=${targetSchedule.childUserId}&role=consultant`;
        window.open(path, '_blank', 'left=0,top=0,width=' + screen.width + ',height=' + screen.height);
    };

    const handleModalClose = async () => {
        setShowModal(false);
        setEditingSchedule(null);
        if (selectedChildId) {
            handleChildSelect({ id: selectedChildId, name: searchTerm });
        } else {
            setDate(new Date(date));
        }
    };

    const handleEditClick = (schedule) => {
        setEditingSchedule({
            scheduleId: schedule.scheduleId,
            childUserId: schedule.childUserId,
            childName: schedule.consultation_target,
            parentName: schedule.parentName,
            parentEmail: schedule.parentEmail,
            type: schedule.consultation_type,
            time: schedule.time,
            date: schedule.date,
        });
        setShowModal(true);
    };

    const handleScheduleUpdate = (updatedSchedule, originalSchedule) => {
        setSchedules(prevSchedules => prevSchedules.map(schedule => {
            if (
                schedule.date === originalSchedule.date &&
                schedule.time === originalSchedule.time &&
                schedule.counsultation_target === originalSchedule.counsultation_target
            ) {
                return updatedSchedule;
            }
            return schedule;
        }));
    };

    const handleFocus = () => {
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 100);
    };

    // 실시간 아동 검색 (선택 상태일 경우 검색하지 않음)
    useEffect(() => {
        if (childSelected) return;
        const handler = setTimeout(() => {
            if (searchTerm.trim()) {
                searchChildByName(searchTerm).then(results => {
                    if (results) {
                        setSuggestions(results.map(child => ({
                            id: child.childUserId,
                            name: child.childUserName,
                            img: child.childProfileUrl !== "Default Image" ? child.childProfileUrl : "/default-profile.png",
                            parentName: child.parentUserName
                        })));
                        setShowSuggestions(true);
                    }
                });
            } else {
                setSuggestions([]);
                // 입력값이 비었으면 달력 하이라이트도 초기화
                setHighlightedDates([]);
            }
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, childSelected]);


    return (
        <>
            <main className="co-schedule-container">
                <CounselorHeader />
                <div className="co_blankdefault" style={{marginTop: '64.49px'}}></div>
                <div className="co-schedule-wrapper">
                    <div className="co-calendar-section">
                        <h2 className="co-select-date">날짜를 선택해주세요.</h2>
                        <div className="co-calendar-wrapper">
                            <Calendar
                                value={date}
                                onChange={handleDateSelect}
                                onViewDateChange={handleViewDateChange}
                                inline
                                dateFormat="yy년 mm월"
                                locale="ko"
                                view="date"
                                monthNavigator
                                yearNavigator
                                yearRange="2000:2040"
                                dateTemplate={dateTemplate}
                            />
                        </div>
                    </div>
                    <div className="co-notcalendar">
                        <div className="co-schedule-section">
                            <div className="co-schedule-content">
                                <div className="co-schedule-header">
                                    <h2 className="co-schedule-title">상담 일정</h2>
                                    <div className="co-search-container">
                                        <span className="p-input-icon-right">
                                            <div className="co-search-container">
                                                <input
                                                    type="text"
                                                    placeholder="아동 이름을 입력하세요"
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
                                                    className="co-search-input"
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
                                                />
                                                {showSuggestions && suggestions.length > 0 && (
                                                    <ul className="co-search-dropdown">
                                                        {suggestions.map((child) => (
                                                            <li
                                                                key={child.id}
                                                                className="co-search-item"
                                                                onMouseDown={() => handleChildSelect(child)}
                                                                style={{cursor:'pointer'}}
                                                            >
                                                                <img
                                                                    src={child.img}
                                                                    alt={child.name}
                                                                    className="co-search-img"
                                                                    style={{ width: "20px", height: "20px", objectFit: "cover", borderRadius: "4px", marginRight: "8px" }}
                                                                />
                                                                {child.name} ({child.parentName})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                <div className="co-schedule-list">
                                    {filteredSchedules.length > 0 ? (
                                        filteredSchedules.map((schedule, index) => (
                                            <div key={index} className="co-schedule-item">
                                                <div className="co-schedule-info">
                                                    <div className="co-schedule-info-first">
                                                        <p>상담 시간 : {schedule.time}</p>
                                                        {searchTerm && (
                                                            <div className="co-schedule-header-row">
                                                                <div className="co-schedule-date">
                                                                    {formatDisplayDate(schedule.date)}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p>상담유형 : {schedule.consultation_type}</p>
                                                    <p>상담대상(이름) : {schedule.consultation_target}</p>
                                                </div>
                                                <div className="co-button-group">
                                                    {!schedule.isCompleted ? (
                                                        <>
                                                            <button
                                                                className="co-btn co-btn-join"
                                                                onClick={() => handleJoin(index)}
                                                            >
                                                                참여
                                                            </button>
                                                            <button
                                                                className="co-btn co-btn-modify"
                                                                onClick={() => handleEditClick(schedule)}
                                                            >
                                                                수정
                                                            </button>
                                                            <button
                                                                className="co-btn co-btn-delete"
                                                                onClick={() => handleDelete(schedule)}
                                                                disabled={schedule.isLoading}
                                                            >
                                                                {schedule.isLoading ? '삭제 중...' : '삭제'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className="co-btn co-btn-completed" disabled>
                                                            참여완료
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="co-no-schedules">
                                            <p>
                                                {searchTerm ? '해당 아동의 상담내역이 없습니다!' : '상담 일정이 없습니다!'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                className="co-schedule-create-btn"
                                onClick={() => {
                                    setEditingSchedule(null);
                                    setShowModal(true);
                                }}
                            >
                                상담 생성
                            </button>
                        </div>
                        {showModal && (
                            <MeetingCreateModal
                                onClose={handleModalClose}
                                isEdit={!!editingSchedule}
                                editData={editingSchedule}
                                onScheduleUpdate={handleScheduleUpdate}
                                bookedSlots={schedules}
                            />
                        )}
                    </div>
                </div>
                <Footer />
                {schedules.some(schedule => schedule.isLoading) && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )}
            </main>
        </>
    );
}

export default CounselorSchedulePage;
