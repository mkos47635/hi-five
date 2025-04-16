import api from "./api";

// 상담사 마이페이지 정보 조회 API 요청
export const getCounselorMyPage = async () => {
    try {
        const response = await api.post("/user/consultant/my-profile");
        return response.data;
    } catch (error) {
        console.error("❌ 상담사 마이페이지 정보 불러오기 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 상담사 계정 비밀번호 변경 API 요청
export const changeConsultantPassword = async ( oldPwd, newPwd) => {
    try {
        const response = await api.post("/user/consultant/change-pwd", {
            oldPwd: oldPwd,
            newPwd: newPwd
        });
        return response.data;
    } catch (error) {
        console.error("❌ 상담사 비밀번호 변경 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 상담사 계정 아이들 정보 가져오기 API 요청
export const getConsultantChildren = async () => {
    try {
        const response = await api.post("/user/consultant/get-my-children");
        return response.data;
    } catch (error) {
        console.error("❌ 상담사 아이들 정보 불러오기 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 특정 아이 정보 가져오기 API 요청
export const getConsultantChild = async (childUserId) => {
    try {
        const validChildUserId = Number(childUserId);
        if (isNaN(validChildUserId)) {
            throw new Error("Invalid childUserId: Not a number");
        }
        const response = await api.get("/user/consultant/get-child", {
            params: { childUserId: validChildUserId }
        });
        return response.data;
    } catch (error) {
        console.error("❌ 특정 아이 정보 불러오기 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 상담사 계정 아이 정보 수정 API 요청
export const modifyConsultantChild = async (childUserId, interest, additionalInfo) => {
    try {
        console.log("📢 아이 정보 수정 요청:", { childUserId, interest, additionalInfo });

        const response = await api.post("/user/consultant/modify-child", {
            childUserId,
            interest,
            additionalInfo
        });

        console.log("✅ 아이 정보 수정 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 아이 정보 수정 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};


// ✅ 상담사 계정에서 학부모 계정 등록 API 요청
export const registerParentAccount = async ({
    parentName,
    parentEmail,
    parentPhone,
    childName,
    childBirth,
    childGender,
    firstConsultDt,
    childInterest = "",
    childAdditionalInfo = ""
}) => {
    try {
        const response = await api.post("/user/consultant/register-parent-account", {
            parentName,
            parentEmail,
            parentPhone,
            childName,
            childBirth,
            childGender,
            firstConsultDt,
            childInterest,
            childAdditionalInfo
        });
        return response.data;
    } catch (error) {
        console.error("❌ 학부모 계정 등록 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 상담사 계정 회원 탈퇴 요청 리스트 불러오기 API 요청
export const getParentDeleteRequests = async () => {
    try {
        const response = await api.post("/user/delete/get-my-delete");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 상담사 탈퇴 요청 리스트 불러오기 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 상담사 탈퇴 요청 승인 (회원 삭제 승인)
export const approveDeleteRequest = async (deleteUserRequestId) => {
    try {
        console.log("📢 탈퇴 요청 승인:", deleteUserRequestId);
        const response = await api.get("/user/delete/approve", {
            params: { deleteUserRequestId: Number(deleteUserRequestId) } // ✅ 변수명 수정 & 숫자로 변환
        });
        console.log("✅ 탈퇴 요청 승인 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 탈퇴 요청 승인 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 상담사 탈퇴 요청 거절 (회원 삭제 거절)
export const rejectDeleteRequest = async (deleteUserRequestId) => {
    try {
        console.log("📢 탈퇴 요청 거절:", deleteUserRequestId);
        const response = await api.get("/user/delete/reject", {
            params: { deleteUserRequestId: Number(deleteUserRequestId) } // ✅ 변수명 수정 & 숫자로 변환
        });
        console.log("✅ 탈퇴 요청 거절 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ 탈퇴 요청 거절 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};


// ✅ 상담사 부모 이메일 중복 확인 API
export const checkConsultantParentEmail = async (email) => {
    try {
        const response = await api.get(`/user/consultant/email-check`, {
            params: { email }
        });
        console.log("이메일 체크 결과: ", response.data)
        return response.data;
    } catch (error) {
        console.error("❌ 부모 이메일 중복 확인 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};
