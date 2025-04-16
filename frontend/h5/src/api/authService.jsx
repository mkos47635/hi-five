import api from "./api";

// ✅ 로그인 API 요청
export const login = async (email, password, role) => {
    try {
        const response = await api.post("/auth/login", {
            email: email,
            pwd: password,
            role: role
        });
        sessionStorage.setItem("access_token", response.data.accessToken);
        return response.data;
    } catch (error) {
        console.error("❌ 로그인 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};


// ✅ 로그아웃 API 요청
export const logout = async () => {
    try {
        const accessToken = sessionStorage.getItem("access_token");
        if (!accessToken) {
            console.warn("🔹 토큰이 없는 상태에서 로그아웃 요청. 단순히 로그아웃 처리");
            return;
        }
        const response = await api.post("/auth/logout", null, { 
            params:{token: accessToken}
         });
        sessionStorage.removeItem("access_token");
        return response.data;
    } catch (error) {
        console.error("❌ 로그아웃 실패:", error.response ? error.response.data : error.message);
    } finally {
        sessionStorage.removeItem("access_token");
        window.location.href = "/";
    }
};

// ✅ 학부모 이메일 찾기 API 요청
export const findParentEmail = async (name, phone) => {
    try {
        const response = await api.post("/user/parent/find-id", {
            name: name,
            phone: phone
        });
        return response.data;
    } catch (error) {
        console.error("❌ 학부모 이메일 찾기 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 상담사 이메일 찾기 API 요청
export const findConsultantEmail = async (name, phone) => {
    try {
        const response = await api.post("/user/consultant/find-id", {
            name: name,
            phone: phone
        });
        return response.data;
    } catch (error) {
        console.error("❌ 상담사 이메일 찾기 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 학부모 계정 임시 비밀번호 발급 API 요청
export const requestParentTempPassword = async (name, email) => {
    try {
        const response = await api.post("/user/parent/temp-pwd", {
            name: name,
            email: email
        });
        return response.data;
    } catch (error) {
        console.error("❌ 학부모 임시 비밀번호 발급 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 상담사 계정 임시 비밀번호 발급 API 요청
export const requestConsultantTempPassword = async (name, email) => {
    try {
        const response = await api.post("/user/consultant/temp-pwd", {
            name: name,
            email: email
        });
        return response.data;
    } catch (error) {
        console.error("❌ 상담사 임시 비밀번호 발급 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getUserInfo = async () => {

    try {
        const accessToken = sessionStorage.getItem("access_token");

        if (accessToken) {
            const response = await api.get("/auth/get-user-info", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
    } catch (error) {
        console.error("❌ 유저 정보 불러오기 실패:", error);
    }
};

