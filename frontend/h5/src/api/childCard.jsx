import api from "./api";

export const getChildCards = async (childId) => {

    try {
        const response = await api.get("/asset/load-cards", {
            params: {
                childUserId : childId,
            }
        });
        console.log(response.data);
        return response.data;
    }catch (error) {
        console.log("📡 전송된 데이터:", error.config?.data); // 요청 데이터 확인
        console.log("📡 전송된 데이터 타입:", typeof error.config?.data);
    }
}