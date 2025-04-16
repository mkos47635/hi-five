import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

const noAuthEndpoints = [
  "/auth/login",
  "/auth/parent/find-id",
  "/user/parent/temp-pwd",
  "/user/consultant/find-id",
  "/user/consultant/temp-pwd",
];

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshingToken = false;
let failedRequestsQueue = [];

// 토큰 재발급 API 요청 함수
export const refreshToken = async () => {
  try {
    console.log("📢 토큰 재발급 요청");
    
    const refreshTokenValue = sessionStorage.getItem("refresh_token");
    if (!refreshTokenValue) {
      throw new Error("Refresh token not found");
    }

    const response = await api.post("/auth/refresh", null, {
      headers: {
        Authorization: `Bearer ${refreshTokenValue}`,
      },
    });

    console.log("✅ 토큰 재발급 성공:", response.data);

    // 새로운 토큰으로 세션스토리지 업데이트
    sessionStorage.setItem("access_token", response.data.accessToken);
    if (response.data.refreshToken) {
      sessionStorage.setItem("refresh_token", response.data.refreshToken);
    }

    // 대기 중인 요청들을 재시도
    failedRequestsQueue.forEach((callback) => callback(response.data.accessToken));
    failedRequestsQueue = [];

    return response.data.accessToken;
  } catch (error) {
    console.error(
      "❌ 토큰 재발급 실패:",
      error.response ? error.response.data : error.message
    );

    // refresh 토큰 요청에 401 에러가 발생하면 로그아웃 처리
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      window.location.href = "/"; // 로그아웃 후 로그인 페이지로 리다이렉트
    }

    // 실패한 요청들 처리
    failedRequestsQueue.forEach((callback) => callback(null));
    failedRequestsQueue = [];

    throw error;
  } finally {
    refreshingToken = false;
  }
};

// 요청 인터셉터: access 토큰 자동 삽입
api.interceptors.request.use((config) => {
  // 인증 없이 접근 가능한 엔드포인트는 그대로 사용
  if (noAuthEndpoints.some((endpoint) => config.url.includes(endpoint))) {
    return config;
  }

  const accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) {
    window.location.href = "/";
    return Promise.reject(new Error("로그인이 필요합니다."));
  }

  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// 응답 인터셉터: 401 발생 시 토큰 재발급 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.error("응답 인터셉터 에러:", error);

    // 인증 없이 접근 가능한 엔드포인트면 그대로 에러 반환
    if (noAuthEndpoints.some((endpoint) => originalRequest.url.includes(endpoint))) {
      return Promise.reject(error);
    }

    // 401 에러 처리 (access 토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshingToken) {
        refreshingToken = true;
        try {
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      } else {
        // 토큰 재발급 진행 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push((newToken) => {
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
