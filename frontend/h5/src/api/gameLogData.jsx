import api from "./api";

const sendAnalysisData = async ({
  selectedOption, 
  corrected, 
  submitDtt, 
  consulted, 
  childGameStageId, 
  childUserId, 
  gameStageId, 
  fHappy, 
  fAnger, 
  fPanic, 
  fFear, 
  tHappy, 
  tAnger, 
  tSad, 
  tPanic, 
  tFear, 
  stt, 
  aiAnalysis 
}) => {
  try {
    const response = await api.post("/game/save-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedOption: parseInt(selectedOption), // Integer 변환
        corrected: Boolean(corrected), // Boolean 변환
        submitDtt: new Date(submitDtt).toISOString(), // LocalDateTime 변환 (ISO 8601 형식)
        consulted: Boolean(consulted), // Boolean 변환
        childGameStageId: parseInt(childGameStageId), // Integer 변환
        childUserId: parseInt(childUserId), // Integer 변환
        gameStageId: parseInt(gameStageId), // Integer 변환
        fHappy: Number(fHappy), // 숫자로 변환
        fAnger: Number(fAnger), 
        fSad: Number(fSad),
        fPanic: Number(fPanic),
        fFear: Number(fFear),
        tHappy: Number(tHappy),
        tAnger: Number(tAnger),
        tSad: Number(tSad),
        tPanic: Number(tPanic),
        tFear: Number(tFear),
        stt: String(stt), // String 변환
        aiAnalysis: String(aiAnalysis) // String 변환
      }),
    });

    const data = await response.json();
    console.log("[sendAnalysisData] 백엔드 응답:", data);
  } catch (error) {
    console.error("[sendAnalysisData] 데이터 전송 실패:", error);
  }
};
