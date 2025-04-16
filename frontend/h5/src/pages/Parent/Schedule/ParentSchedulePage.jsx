import ParentHeader from "../../../components/Parent/ParentHeader";
import Footer from "../../../components/common/Footer";
import { Calendar } from 'primereact/calendar';
import { useState, useEffect } from 'react';
import { addLocale } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import '../ParentCss/ParentSchedulePage.css';
import { getScheduledDatesByParent, getParentScheduleList } from "/src/api/schedule";

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

function ParentSchedulePage() {
    const [date, setDate] = useState(new Date());
    const [searchTerm] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [scheduledDates, setScheduledDates] = useState([]);
    const [scheduleList, setScheduleList] = useState([]); // 🔹 부모 상담 리스트 상태 추가


    useEffect(() => {
        async function fetchScheduledDates() {
            try {
                const selectedYear = currentMonth.getFullYear(); // ✅ 정확한 값 설정
                const selectedMonth = currentMonth.getMonth() + 1;

                console.log(`📢 상담 일정 요청 (Year: ${selectedYear}, Month: ${selectedMonth})`);

                const dates = await getScheduledDatesByParent(selectedYear, selectedMonth);
                console.log("✅ 상담 예약 날짜 응답 확인:", dates);

                setScheduledDates(dates.map(date => formatDateToString(new Date(date))));
            } catch (error) {
                console.error("❌ 상담 일정 날짜를 불러오는 데 실패했습니다.", error);
            }
        }

        if (currentMonth) { // ✅ currentMonth가 존재할 때만 실행
            fetchScheduledDates();
        }
    }, [currentMonth]); // ✅ 년도, 월이 바뀔 때만 실행


    useEffect(() => {
        setTimeout(() => {
            highlightScheduledDatesInDOM();
        }, 500); // 달력 렌더링 후 실행
    },);

    useEffect(() => {
        async function fetchScheduleList() {
            try {
                const formattedDate = formatDateToString(date); // YYYY-MM-DD 변환
                console.log("📅 요청할 날짜:", formattedDate); // ✅ 날짜 확인

                const data = await getParentScheduleList(formattedDate);

                console.log("✅ API에서 받은 schedules:", data); // ✅ 응답 확인

                setScheduleList(data);
            } catch (error) {
                console.error("❌ 상담 일정 불러오기 실패", error);
            }
        }

        fetchScheduleList();
    }, [date]);




    // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
    const formatDateToString = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatTimeFromDateTime = (dateTime) => {
        if (!dateTime || !Array.isArray(dateTime)) return { time: "시간 정보 없음", date: "" };

        try {
            const [, month, day, hour, minute] = dateTime;
            const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
            const formattedDate = `${month}/${day}`; // "2/9" 형식으로 변환

            return { time: formattedTime, date: formattedDate };
        } catch (error) {
            console.error("❌ 시간 포맷팅 실패:", error);
            return { time: "시간 정보 없음", date: "" };
        }
    };





    // 🔹 달력이 렌더링된 후, 예약된 날짜에 스타일을 추가하는 함수
    const highlightScheduledDatesInDOM = () => {
        setTimeout(() => {
            const calendarCells = document.querySelectorAll(".p-datepicker td > span");
            calendarCells.forEach((cell) => {
                const dateText = cell.innerText.padStart(2, "0"); // "1" -> "01" 변환
                const selectedDate = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${dateText}`;
                if (scheduledDates.includes(selectedDate)) {
                    cell.classList.add("highlight-circle"); // ✅ 클래스 추가
                }
            });
        }, 100);
    };


    const [schedules] = useState([
        ].sort((a, b) => {
        const timeA = a.time.split('~')[0].trim();
        const timeB = b.time.split('~')[0].trim();
        return timeA.localeCompare(timeB);
    })); // 시간순으로 나열해주는 로직

    // 날짜 표시 포맷 함수 (M/DD)
    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const handleJoin = (schedule) => {
        const childId = schedule.childUserId;
        const type = schedule.type;
        if(type === "consult"){
            window.open(
                `/parent/schedule/call?childId=${childId}&type=${type}&role=parent`,
                '_blank',
                'left=0,top=0,width=' + screen.width + ',height=' + screen.height
            );
        }else if(type === "game"){
            window.open(
                `/child/${childId}`,
                'ChildMainPage',
                'left=0,top=0,width=' + screen.width + ',height=' + screen.height
            );
        }

    };

    return (
        <>
            <main className="pa-schedule-container">
                <ParentHeader />
                <div className="co_blankdefault" style={{marginTop: '64.49px'}}></div>
                <div className="pa-schedule-wrapper">
                    <div className="pa-calendar-section">
                        <h2 className="pa-select-date">날짜를 선택해주세요.</h2>
                        <div className="pa-calendar-wrapper">
                        <Calendar
                            value={date}
                            onChange={(e) => setDate(e.value)}
                            onViewDateChange={(e) => {
                                setCurrentMonth(e.value);
                                setDate(e.value); // 🔹 달력에서 년/월 변경 시에도 반영되도록 수정
                            }}
                            inline
                            dateFormat="yy년 mm월"
                            locale="ko"
                            view="date"
                            monthNavigator
                            yearNavigator
                            yearRange="2000:2040"
                        />

                        </div>
                    </div>
                    <div className="pa-notcalendar">
                        <div className="pa-schedule-section">
                            <div className="pa-schedule-header">
                                <h2 className="pa-schedule-title">
                                    상담 일정
                                    {!searchTerm && ( // 검색어가 없을 때만 날짜 표시
                                        <span className="pa-selected-date">
                                            ({formatDisplayDate(date)})
                                        </span>
                                    )}
                                </h2>
                            </div>
                            <div className="pa-schedule-list">
                                {scheduleList
                                    .filter((schedule) => formatTimeFromDateTime(schedule.schdlDttm).date === formatDisplayDate(date)) // 날짜 필터링
                                    .map((schedule, index) => (
                                        <div key={index} className="pa-schedule-item">
                                            <div className="pa-schedule-info">
                                                <p>상담 시간 : {formatTimeFromDateTime(schedule.schdlDttm).time}</p>
                                                <p>상담유형 : {schedule.type === "game" ? "게임 상담" : "일반 상담"}</p>
                                                <p>상담대상(이름) : {schedule.childName}</p>
                                                <p>담당 상담사 : {schedule.consultantName}</p>
                                            </div>
                                            <div className="pa-button-group">
                                                <button className="pa-btn pa-btn-join" onClick={() => handleJoin(schedule)}>
                                                    참여
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }

                                {scheduleList.filter((schedule) => formatTimeFromDateTime(schedule.schdlDttm).date === formatDisplayDate(date)).length === 0 && (
                                    <div className="pa-no-schedules">
                                        <p>선택한 날짜에 상담 일정이 없습니다!</p>
                                    </div>
                                )}
                            </div>

                        </div>
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


export default ParentSchedulePage;
