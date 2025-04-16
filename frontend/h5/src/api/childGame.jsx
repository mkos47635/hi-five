import api from "./api";

// 게임 챕터 리스트(복습하기)
export const chapter = async () => {
  try {
    console.log("📢 게임리스트 요청 시작");

    const childUserId = sessionStorage.getItem("childId");
    const response = await api.get("/asset/load-chapter-asset", {
      params: { childUserId },
    });
    console.log("✅ 게임 리스트 요청 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ 게임 리스트 요청 실패:",
      error.response?.status,
      error.response?.data
    );
    return null;
  }
};

// 0. 게임 로그
export const saveGameData = async (gameLearningDocumentList) => {
  try {
    console.log("📢 아동 게임 데이터 저장 : ", gameLearningDocumentList);

    const response = await api.post("/game/save-log", gameLearningDocumentList);
    console.log("✅ 아동 게임 데이터 저장 성공:", response.data);
    return response.data;

  } catch (error) {
    console.error(
        "❌ 아동 게임 데이터 저장 실패:",
        error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// 1. 챕터 시작
export const startChapter = async(chapterStartData) => {
  try{
    console.log("📢 아동 게임시작 데이터 저장 : ", chapterStartData);

    const response = await api.post("/game/start-game-chapter", chapterStartData);
    console.log("✅ 아동 게임 데이터 저장 성공:", response.data);
    return response.data;
  }catch (error) {
    console.error(
        "❌ 아동 게임 챕터 데이터 저장 실패:",
        error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// 2. 게임 스테이지 시작
export const startStage = async(chapterStartData)=>{
  try{
    console.log("📢 아동 게임시작 스테이지 데이터 저장 : ", chapterStartData);
    const response = await api.post("/game/start-game-stage", chapterStartData)
    console.log("✅ 아동 게임시작 스테이지 데이터 저장 성공:", response.data);
    return response.data;
  }catch(error){
    console.error( "❌ 아동 게임시작 스테이지 데이터 저장 실패:",
        error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// 3. 게임 챕터 종료
export const endChapter = async(chapterEndData)=>{
  try{
    console.log("📢 아동 게임시작 쳅터 종료 데이터 저장 : ", chapterEndData);
    const response = await api.post("/game/end-game-chapter", chapterEndData)
    console.log("✅ 아동 게임 쳅터 종료 데이터 저장 성공:", response.data);
    return response.data;
  }catch(error){
    console.error( "❌ 아동 게임 챕터 종료 데이터 저장 실패:",
        error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export const updateChildStage = async(updateChildStageData) => {
  try{
    const response = await api.post("/game/update-child-stage", updateChildStageData);
    return response.data;
  }catch(error){
    console.error("아동 최종 학습 게임 스테이지 갱신 실패" ,
        error.response ? error.response.data : error.message)
    throw error;
  }
}

