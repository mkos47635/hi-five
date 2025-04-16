import api from "./api";

// 부모 마이페이지 정보 조회 API 요청
export const getParentMyPage = async () => {
    try {
        console.log("📢 부모 마이페이지 정보 요청");
        const response = await api.post("/user/parent/my-page");
        return response.data;
    } catch (error) {
        console.error("❌ 마이페이지 정보 불러오기 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 학부모 계정 비밀번호 변경 API 요청
export const changeParentPassword = async (oldPwd, newPwd) => {
    try {
        console.log("📢 학부모 비밀번호 변경 요청:", { oldPwd, newPwd });
        const response = await api.post("/user/parent/change-pwd", {
            oldPwd: oldPwd,
            newPwd: newPwd
        });
        return response.data;
    } catch (error) {
        console.error("❌ 학부모 비밀번호 변경 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 부모 계정 아이 이름 가져오기 API 요청
export const getParentChildren = async () => {
    try {
        console.log("📢 부모 계정 아이 목록 요청");
        const response = await api.get("/user/parent/my-children");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 부모 계정 아이 목록 불러오기 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 부모 계정 삭제 요청 API
export const requestParentAccountDeletion = async () => {
    try {
        console.log("📢 부모 계정 삭제 요청");
        const response = await api.post("/user/delete/request");
        console.log("✅ 부모 계정 삭제 요청 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 부모 계정 삭제 요청 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};