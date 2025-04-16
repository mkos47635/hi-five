import api from "./api";

export const reviewGame = async (chapter, stage) => {
  try {
    console.log("📢 게임데이터 요청 시작");
    // console.log(typeof chapter, chapter);
    // console.log(typeof stage, stage);

    const accessToken = sessionStorage.getItem("access_token");
    console.log(accessToken);

    const response = await api.get("/asset/load-stage-asset", {
      params: {
        chapter: chapter,
        stage: stage,
      },
    });

    console.log("✅ 게임데이터 요청 성공:", response);

    return response.data;
  } catch (error) {
    console.log("📡 전송된 데이터:", error.config?.data); // 요청 데이터 확인
    console.log("📡 전송된 데이터 타입:", typeof error.config?.data);
    console.error("❌ 게임데이터 요청 실패:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config,
    });
    return null;
  }
};


export const limitGamedata = async (childId) => {
  try {
    console.log(`📢 아동(${childId}) 비디오 날짜 불러오기`);
    const response = await api.get(`/asset/get-stage/${childId}`, {
      params: {
        childId: childId
      }
    });
    return response.data; // 응답 데이터 반환 추가
  } catch (error) { // error 파라미터 추가
    console.log("📡 전송된 데이터:", error.config?.data);
    console.error("❌ 게임데이터 요청 실패:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config,
    });
    return null;
  }
};