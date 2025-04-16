// src/pages/Child/ChildChatbotPage.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card } from "primereact/card";
import ChildMainBackground from "/src/components/Child/ChildMainBackground";
import { saveChatBotData } from "/src/api/ai"; // API 호출 함수 import
import "/src/pages/Child/ChildCss/ChildChatbotPage.css";
import { useParams } from "react-router-dom";

function ChildChatbotPage() {
  // 상태 변수 선언
  const [messages, setMessages] = useState([]); // 메시지 배열 (형식: { type: 'bot' | 'user', message: string })
  const [stage, setStage] = useState(1); // 1: 첫번째 질문, 2: 두번째 질문 이후 감정 분석
  const [userResponses, setUserResponses] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const recognitionRef = useRef(null);
  const { childId } = useParams();

  // 챗봇 질문 및 최종 응답 메시지 (메모이제이션)
  const chatbotPrompts = useMemo(
    () => ({
      stage1: "오늘 하루 어떤 일이 있었니?",
      stage2: "그래서 어떤 감정이 들었어?"
    }),
    []
  );

  const messagesRef = useRef([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const finalResponses = useMemo(
    () => ({
      happy:
        "오늘 우리 친구의 감정은 기쁨이구나! 너의 행복한 마음이 나에게도 전해져! 내일도 이렇게 기쁜 하루 보내자!",
      sad:
        "오늘은 슬픔이 느껴지는 날이었구나. 때로는 슬픔도 우리를 성장시키는 법이야. 내일은 더 좋은 날이 될 거야.",
      angry:
        "오늘은 화가 나는 일이 있었구나. 마음을 진정시키고 쉬어가며 내일을 준비해보자.",
      fear:
        "두려움이 있었던 하루였네. 하지만 용기를 내어 앞으로 나아가는 너를 응원해!",
      surprised:
        "오늘은 놀라움이 가득했던 하루였구나! 새로운 경험이 너에게 많은 영감을 주었길 바래!"
    }),
    []
  );

  // addMessage: 메시지를 추가하는 함수 (stable)
  const addMessage = useCallback((sender, text) => {
    const newMsg =
      sender === "bot"
        ? { type: "bot", message: text }
        : { type: "user", message: text };
    setMessages((prev) => [...prev, newMsg]);
  }, []);

  // playTTS: 텍스트를 음성으로 출력하는 함수 (stable)
  const playTTS = useCallback((text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    speechSynthesis.speak(utterance);
  }, []);

  // handleChatbotPrompt: 챗봇 메시지를 추가하고 TTS로 읽어주는 함수 (stable)
  const handleChatbotPrompt = useCallback(
    (prompt) => {
      addMessage("bot", prompt);
      playTTS(prompt);
    },
    [addMessage, playTTS]
  );

  // GPT-4 감정 분석 API 호출 함수 (stable)
  const callGPT4 = useCallback(async (sentence) => {
    const prompt = `다음 문장에 대해 다섯 가지 감정(happy, sad, angry, fear, surprised)이 각각 몇 퍼센트인지 분석해줘.
문장: "${sentence}"
출력은 JSON 형식으로 해줘. 예시: {"happy": 92, "sad": 0, "angry": 0, "fear": 0, "surprised": 8}`;
    const messagesForGPT = [
      { role: "system", content: "당신은 감정 분석 전문가입니다." },
      { role: "user", content: prompt }
    ];
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 주의: 클라이언트에 API 키를 포함시키는 것은 보안에 취약합니다.
          Authorization: `Bearer ${import.meta.env.VITE_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-2024-08-06",
          messages: messagesForGPT,
          temperature: 0
        })
      });
      const json = await response.json();
      const reply = json.choices[0].message.content;
let emotionData;
try {
  // 응답이 markdown 코드 블록으로 감싸져 있는 경우 이를 제거
  let cleanedReply = reply;
  if (cleanedReply.startsWith("```")) {
    cleanedReply = cleanedReply
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
  }
  emotionData = JSON.parse(cleanedReply);
} catch (error) {
  console.error("JSON 파싱 에러:", error);
  // fallback: 첫번째 '{'와 마지막 '}' 사이의 부분 추출
  const jsonStart = reply.indexOf("{");
  const jsonEnd = reply.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = reply.substring(jsonStart, jsonEnd + 1);
    try {
      emotionData = JSON.parse(jsonString);
    } catch (e) {
      console.log(e);
      throw new Error("추출된 JSON 파싱 실패");
    }
  } else {
    throw new Error("유효한 JSON 부분을 찾을 수 없음");
  }
}

      
      
      return emotionData;
    } catch (error) {
      console.error("GPT-4 에러:", error);
      throw error;
    }
  }, []);

  // 컴포넌트 마운트 시, stage 1에서 인삿말과 첫번째 질문 출력
  useEffect(() => {
    if (stage === 1) {
      const childName = sessionStorage.getItem("childName") || "친구";
      const text = `안녕 ${childName} 감정아! 만나서 반가워!`;
      handleChatbotPrompt(text);
      handleChatbotPrompt(chatbotPrompts.stage1);
    }
  }, [stage, handleChatbotPrompt, chatbotPrompts.stage1]);

  // 메시지 추가 시, 대화창 스크롤 최하단 이동
  useEffect(() => {
    const chatbox = document.querySelector(".ch-chatbot-box");
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }, [messages]);

  // startVoiceRecognition: 음성 인식을 시작하는 함수 (stable)
  const startVoiceRecognition = useCallback(() => {
    if (chatEnded) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("이 브라우저는 SpeechRecognition을 지원하지 않습니다.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsRecording(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      addMessage("user", transcript);
      setUserResponses((prev) => [...prev, transcript]);
      if (stage === 1) {
        setStage(2);
        setTimeout(() => {
          handleChatbotPrompt(chatbotPrompts.stage2);
        }, 500);
      } else if (stage === 2) {
        const combined = [...userResponses, transcript].join(", ");
        try {
          const emotionScores = await callGPT4(combined);
          let dominantEmotion = "";
          let maxScore = -1;
          for (let [emotion, score] of Object.entries(emotionScores)) {
            if (score > maxScore) {
              maxScore = score;
              dominantEmotion = emotion;
            }
          }
          const finalMessage =
            finalResponses[dominantEmotion] || "오늘 하루 수고했어!";
          addMessage("bot", finalMessage);
          playTTS(finalMessage);

          // 대화 로그를 JSON 배열 형태로 생성하여 API로 전송
          // 각 메시지 객체에는 childUserId, sender, messageIndex, message가 포함됩니다.
          // finalMessage를 messagesRef.current에 직접 추가하여 최신 대화 내역에 포함
          const updatedMessages = [...messagesRef.current, { type: "bot", message: finalMessage }];
          const chatbotDocumentList = updatedMessages.map((msg, index) => ({
            childUserId: Number(childId),
            sender: msg.type === "bot" ? "gpt" : "user",
            messageIndex: Number(index),
            message: msg.message,
          }));
          await saveChatBotData(chatbotDocumentList);



          setChatEnded(true);
        } catch (error) {
          console.error("GPT-4 처리 에러:", error);
          setChatEnded(true);
        }
      }
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("음성 인식 에러:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [
    chatEnded,
    stage,
    addMessage,
    handleChatbotPrompt,
    chatbotPrompts.stage2,
    userResponses,
    callGPT4,
    finalResponses,
    playTTS,
    childId
  ]);

  // 음성 입력을 자동 시작하는 useEffect (1.5초 후)
  useEffect(() => {
    if (!chatEnded && (stage === 1 || stage === 2)) {
      const timer = setTimeout(() => {
        if (!isRecording) {
          startVoiceRecognition();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [stage, chatEnded, isRecording, startVoiceRecognition]);

  return (
    <div className="ch-chatbot-container">
      <ChildMainBackground />
      <Card className="ch-chatbot-background-container">
        {/* 헤더 */}
        <div className="ch-chatbot-header-container">
          <img
            src="/child/chatbot/chatbotCh.png"
            alt="Chatbot character"
            className="ch-chatbot-cha"
          />
        </div>
        <div className="ch-chatbot-title">
          <h1>마음이</h1>
          <p>마음이에게 감정을 들려줄래?</p>
        </div>
        {/* 챗봇 대화창 */}
        <div className="ch-chatbot-box">
          {messages.map((msg, index) =>
            msg.type === "bot" ? (
              <div key={index} className="ch-chat-bubble bot">
                <img
                  src="/child/chatbot/chatbotCh.png"
                  alt="chatbotCh"
                  className="ch-chatbot-icon-chatbotch"
                />
                <span className="ch-chat-text bot-text">{msg.message}</span>
              </div>
            ) : (
              <div key={index} className="ch-chat-bubble user">
                <span className="ch-chat-text user-text">{msg.message}</span>
                <img
                  src="/child/chatbot/chatuser.PNG"
                  alt="chatuser"
                  className="ch-chatbot-icon-chatuser"
                />
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );
}

export default ChildChatbotPage;
