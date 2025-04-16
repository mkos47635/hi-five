import api from "./api";





// ✅ 상담 일정 생성
export const createSchedule = async (childId, schdlDttm, type) => {
    try {
        console.log("📢 상담 일정 생성 요청:", { childId, schdlDttm, type });

        const requestBody = {
            childId,
            schdlDttm,
            type,
        };

        const response = await api.post("/schedule/create", requestBody);

        console.log("✅ 상담 일정 생성 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 상담 일정 생성 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 상담 일정 수정 (업데이트)
export const updateSchedule = async (id, childId, schdlDttm, type) => {
    try {
        console.log("📢 상담 일정 수정정 요청:", { id, childId, schdlDttm, type });

        const requestBody = {
            id,
            childId,
            schdlDttm,
            type,
        };

        const response = await api.put("/schedule/update", requestBody);

        console.log("✅ 상담 일정 수정 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 상담 일정 수정 실패:", error.response ? error.response.data : error.message);
        return { status: "error", message: error.response?.data?.message || "상담 수정 실패" };
    }
};

// ✅ 상담 일정 삭제 API 요청
export const deleteSchedule = async (scheduleId, type) => {
    try {
        console.log("📢 상담 일정 삭제 요청:", { scheduleId, type });

        const requestBody = {
            id: scheduleId, // 상담 일정 ID
            type: type // 'game' 또는 'consult'
        };

        const response = await api.put(`/schedule/delete/${scheduleId}`, requestBody);

        console.log("✅ 상담 일정 삭제 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 상담 일정 삭제 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};


// 상담 생성 시 아이 이름으로 검색 API
export const searchChildByName = async (childUserName) => {
    try {
        console.log(`📢 아이 이름 검색 요청: ${childUserName}`);
        const response = await api.get(`/user/consultant/search-child/${encodeURIComponent(childUserName)}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔹 인증 토큰 추가
            },
            withCredentials: true, // 🔹 CORS 관련 쿠키 허용 (필요한 경우)
        });
        console.log("✅ 아이 검색 성공:", response.data);
        return response.data; // 🔹 검색된 아이 정보 반환
    } catch (error) {
        console.error("❌ 아이 검색 실패:", error.response ? error.response.data : error.message);
        return null; // 🔹 실패 시 `null` 반환
    }
};


// ✅ 부모 계정의 상담 예약 날짜 가져오기
export const getScheduledDatesByParent = async (year, month) => {
    try {
        if (!year || !month) {
            throw new Error("❌ 유효하지 않은 year 또는 month 값입니다.");
        }

        console.log(`📢 부모 상담 예약 날짜 요청 (Year: ${year}, Month: ${month})`);

        const response = await api.get("/schedule/dates-by-parent", {
            params: { year, month } // ✅ 백엔드에서 필수로 요구하는 값 추가
        });

        console.log("✅ 상담 예약 날짜 가져오기 성공:", response.data);

        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("❌ 상담 예약 날짜 가져오기 실패:", error.response ? error.response.data : error.message);
        return []; // 오류 발생 시 빈 배열 반환
    }
};


// ✅ 부모 계정의 상담 리스트 가져오기
export const getParentScheduleList = async (date) => {
    try {
        // 🔹 date가 Date 객체인지 확인 후 변환
        const formattedDate = typeof date === "string" ? date : formatDateToString(date);

        // 🔹 년, 월, 일 추출
        const year = formattedDate.split("-")[0];
        const month = formattedDate.split("-")[1];

        console.log(`📢 부모 상담 리스트 요청 (Date: ${formattedDate}, Year: ${year}, Month: ${month})`);

        const response = await api.get("/schedule/list-by-parent", {
            params: { year, month }, // 🔹 API 요구사항에 맞게 전달
        });

        console.log("✅ 부모 상담 리스트 조회 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 부모 상담 리스트 조회 실패:", error.response ? error.response.data : error.message);
        return [];
    }
};

// ✅ 상담사 계정의 상담 리스트 가져오기
export const getConsultantScheduleList = async (date) => {
    try {
        console.log(`📢 상담사 상담 리스트 요청 (Date: ${date})`);
        const response = await api.get("/schedule/list-by-date", {
            params: { date }
        });
        console.log("✅ 상담사 상담 리스트 조회 성공:", response.data);
        return response.data; // 상담 리스트 반환
    } catch (error) {
        console.error("❌ 상담사 상담 리스트 조회 실패:", error.response ? error.response.data : error.message);
        return [];
    }
};

// ✅ 상담사 계정의 특정 아이 상담 예약 날짜 가져오기
export const getChildScheduleDates = async (childId, year, month) => {
    try {
        console.log(`📢 특정 아동 상담 날짜 요청 (Child ID: ${childId}, Year: ${year}, Month: ${month})`);
        const response = await api.get("/schedule/dates-by-child", {
            params: { childId, year, month }
        });
        console.log("✅ 특정 아동 상담 날짜 조회 성공:", response.data);
        return response.data; // 상담 날짜 리스트 반환
    } catch (error) {
        console.error("❌ 특정 아동 상담 날짜 조회 실패:", error.response ? error.response.data : error.message);
        return [];
    }
};

// ✅ 상담사 계정의 특정 아이 상담 리스트 가져오기
export const getChildScheduleList = async (childId, year, month) => {
    try {
        console.log(`📢 특정 아동 상담 리스트 요청 (Child ID: ${childId}, Year: ${year}, Month: ${month})`);
        const parsedChildId = parseInt(childId, 10);
        const parsedYear = parseInt(year, 10);
        const parsedMonth = parseInt(month, 10);
        const response = await api.get("/schedule/list-by-child", {
            params: { 
                childId: parsedChildId, 
                year: parsedYear, 
                month: parsedMonth 
            }
        });
        console.log("✅ 특정 아동 상담 리스트 조회 성공:", response.data);
        return response.data; // 상담 리스트 반환
    } catch (error) {
        console.error("❌ 특정 아동 상담 리스트 조회 실패:", error.response ? error.response.data : error.message);
        return [];
    }
};



// 🔹 yyyy-MM-dd 형식으로 변환하는 함수
const formatDateToString = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};