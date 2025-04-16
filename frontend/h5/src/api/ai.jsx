import api from "./api";

export const saveChatBotData = async (chatbotDocumentList) => {
  try {
    console.log("📢 챗봇 데이터 저장 : ", chatbotDocumentList);
    
    const response = await api.post("/chatbot/save", {
      chatbotDocumentList
    });
    console.log("✅ 챗봇 데이터 저장 성공:", response.data);
    return response.data;
    
  } catch (error) {
    console.error(
      "❌ 챗봇봇 데이터 저장 실패:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getChatBotData = async (childUserId, date) => {
  try {
    console.log("📢 챗봇 데이터 불러오기: ", childUserId, date);

    const response = await api.get("/chatbot/get-chatbot", {
      params: { childUserId, date },
    });
    console.log("✅ 챗봇 데이터 불러오기 성공:", response.data);
    return response.data;

  } catch (error) {
    console.error(
        "❌ 챗봇 데이터 불러오기 실패:",
        error.response ? error.response.data : error.message
    );
    throw error;
  }
};
