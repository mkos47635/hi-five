import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import PropTypes from "prop-types";
import { getChatBotData } from "../../api/ai";
import "./ChatBotData.css";

// 기본 샘플 데이터 (API 호출 전 기본값으로 사용)
const sampleData = {
  chatbotDtos: [],
};

function ChatBotData({ selectedDate, selectedChild }) {
  const [chatData, setChatData] = useState(sampleData);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    async function fetchChatData() {
      try {
        const formattedDate = formatDate(selectedDate);
        const response = await getChatBotData(
          Number(selectedChild.childUserId),
          formattedDate
        );
        console.log("챗봇 데이터 조회 결과:", response);
        const transformedData = {
          chatbotDtos: response.chatBotDocumentList,
        };
        setChatData(transformedData);
      } catch (error) {
        console.error("챗봇 데이터 조회 실패:", error);
      }
    }
    if (selectedChild && selectedDate) {
      fetchChatData();
    }
  }, [selectedChild, selectedDate]);

  const { chatbotDtos } = chatData;

  return (
    <div className="chatbot-history-page">
      <div className="chatbot-history-container">
        <Card className="chatbot-history-card">
          <div className="chatbot-box">
            {chatbotDtos && chatbotDtos.length > 0 ? (
              chatbotDtos.map((msg, index) => {
                const isBot = msg.sender === "gpt";
                return (
                  <div
                    key={index}
                    className={`chat-bubble ${isBot ? "gpt" : "user"}`}
                  >
                    {isBot && (
                      <img
                        src="/child/chatbot/chatbotCh.png"
                        alt="chatbotCh"
                        className="chatbot-icon"
                      />
                    )}
                    <span
                      className={`chat-text ${
                        isBot ? "bot-text" : "user-text"
                      }`}
                    >
                      {msg.message}
                    </span>
                    {!isBot && (
                      <img
                        src="/child/chatbot/chatuser.PNG"
                        alt="chatuser"
                        className="chatuser-icon"
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <p className="no-chat-data">저장된 대화 내역이 없습니다.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

ChatBotData.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  selectedChild: PropTypes.object.isRequired,
};

export default ChatBotData;
