// import chatbot from "react-chatbot-kit";
import { createChatBotMessage } from "react-chatbot-kit";
import ChildMainBackground from "../../components/Child/ChildMainBackground";
import "./ChildCss/ChildChatbotPage.css";
import { useState } from "react";

function ChildChatbotPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // 아동 들어오면 바로 감정이 렌더링 시작

  // 초기 메세지 설정
  const config = {
    initialMessages: [
      createChatBotMessage("안녕 000감정아! 만나서 반가워!", {
        delay: 500,
      }),
      createChatBotMessage("나는 마음이라고 해!", { delay: 1500 }),
      createChatBotMessage("오늘 너의 이야기를 들려줄래?", { delay: 1500 }),
      createChatBotMessage("어떤 일이 있었는지 궁금해~", { delay: 1500 }),
    ],

    steps: [
      {
        question: "오늘 하루 어떤 일이 있었니?",
        nextStep: 1,
      },
      {
        question: "그래서 어떤 감정이 들었어?",
        nextStep: 2,
      },
      {
        question: "",
        nextStep: "result",
      },
    ],

    // 결과 메세지
    // + 결과 카드?
    results: {
      기쁨: [
        createChatBotMessage("오늘 우리 00 감정이의 감정은 기쁨이구나!"),
        createChatBotMessage(
          "너의 행복한 마음이 나한테도 전해져! 내일도 이렇게 기쁜 하루 보내자!"
        ),
      ],
      슬픔: [
        createChatBotMessage("오늘 우리 00 감정이의 감정은 슬픔이구나.."),
        createChatBotMessage(
          "오늘 많이 슬펐지만, 내일은 더 좋은 일이 생길 거야!"
        ),
      ],
      분노: [
        createChatBotMessage("오늘 우리 00 감정이의 감정은 분노구나.."),
        createChatBotMessage(
          "속상하고 화나는 일이 있었구나. 화가 날 때는 세 번 크게 숨을 쉬어보자! 마음이가 항상 네 편이야."
        ),
      ],
      공포: [
        createChatBotMessage("오늘 우리 00 감정이의 감정은 공포구나.."),
        createChatBotMessage(
          "두려운 마음이 들 때는 마음이를 생각하면서 심호흡 해보자. 내가 항상 지켜줄게!"
        ),
      ],
      놀람: [
        createChatBotMessage("오늘 우리 00 감정이의 감정은 놀람이구나!"),
        createChatBotMessage(
          "놀란 가슴을 쓸어내리며 심호흡 한번 해볼까? 마음이가 네 옆에 있어줄게!"
        ),
      ],
    },
  };

  // 종료메세지 나온 후 몇초 뒤 종료 알람이 나오고 바로 메인페이지로 이동

  // 음성 응답 처리 함수
  const voiceChatResponse = (res) => {
    if (currentStep < config.steps.length) {
      // 다음 단계로 진행
      setCurrentStep(currentStep + 1);
      // 다음 질문 표시
      if (currentStep + 1 < config.steps.length) {
        return config.steps[currentStep + 1].question;
      } else {
        // 모든 응답을 받은 후 결과 표시
        const result = getResult();
        return result;
      }
    }
  };

  // 결과 생성 함수_오늘의 감정
  // ai 분석결괄르 토대로 한 결과 메세지 반환
  const getResult = () => {
    return config.results;
  };

  return (
    <div className="ch-chatbot-container">
      <ChildMainBackground />
      <div className="ch-chatbot-box">
        {/* <img
          src="/child/chatbot"
          alt="chatbotcharacter"
          className="ch-chatbot-ch"
        />
        <img
          src="/child/speechBubble.png"
          alt="speechBubble"
          className="ch-speechBubble" */}
        {/* /> */}
      </div>
    </div>
  );
}

export default ChildChatbotPage;

// 챗봇 대화
// 아동 대화
//
// 스타트 버튼
// 종료()
