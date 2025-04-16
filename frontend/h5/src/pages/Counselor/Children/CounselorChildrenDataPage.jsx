import { useState, useEffect, useCallback } from "react";
import { Chart } from "primereact/chart";
import { Calendar } from "primereact/calendar";
import ChatBotData from "/src/components/common/ChatBotData";
import Footer from "/src/components/common/Footer";
import "/src/pages/Parent/ParentCss/ParentChildPage.css";
import CounselorHeader from "../../../components/Counselor/CounselorHeader";
import { getChildEmotionData, getChatBotDate, getVideoDate } from "/src/api/childData";
import { useUserStore } from "/src/store/userStore";

function CounselorChildrenDataPage() {
  // useUserStore에서 단일 아이의 정보를 가져옵니다.
  const selectedChild = useUserStore((state) => state.childData);

  const [currentStage, setCurrentStage] = useState(1);
  const [emotionData, setEmotionData] = useState(null);

  const [dateChatBot, setDateChatBot] = useState(new Date());
  const [dateVideo1, setDateVideo1] = useState(new Date());
  const [dateVideo2, setDateVideo2] = useState(new Date());

  const [chatBotDates, setChatBotDates] = useState([]);
  const [videoDates1, setVideoDates1] = useState([]);
  const [videoDates2, setVideoDates2] = useState([]);

  const [prevChatBotMonth, setPrevChatBotMonth] = useState(dateChatBot.getMonth());
  const [prevVideoMonth1, setPrevVideoMonth1] = useState(dateVideo1.getMonth());
  const [prevVideoMonth2, setPrevVideoMonth2] = useState(dateVideo2.getMonth());

  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [analysisResult, setAnalysisResult] = useState("");
  const [analysisError, setAnalysisError] = useState("");

  const AI_KEY = import.meta.env.VITE_APP_OPENAI_API_KEY;

  const analyzeEmotionData = useCallback(async (data) => {
    if (!data) return;

    // 분석용 데이터 구조 생성
    const analysisData = {
      emotions: {
        joy: data["1"].rating,
        sadness: data["2"].rating,
        anger: data["3"].rating,
        fear: data["4"].rating,
        surprise: data["5"].rating
      },
      stages: {
        stage1: {
          joy: data["1"].stageCrtCnt1,
          sadness: data["2"].stageCrtCnt1,
          anger: data["3"].stageCrtCnt1,
          fear: data["4"].stageCrtCnt1,
          surprise: data["5"].stageCrtCnt1
        },
        // 필요 시 다른 스테이지 추가
      }
    };

    const prompt = `
      아래 JSON 데이터는 아이의 각 감정 관련 학습 진행도를 나타냅니다.
      수치가 낮을수록 해당 감정 관련 단어 학습이 덜 된 상태입니다.
      출력 형식을 제외하고는 어떤 말도 입력하지 마세요.

      JSON 데이터:
      ${JSON.stringify(analysisData, null, 2)}

      출력 형식 (예시):
      <p>
        현재 아이는 <strong>놀라움</strong>이나 <strong>두려움</strong> 관련 단어들을 조금 어려워하는 경향이 있습니다.
      </p>
      <p>
        <strong>주 감정:</strong> 기쁨 <br />
        <strong>보완 감정:</strong> 분노
      </p>
    `;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      const apiData = await response.json();

      if (apiData.error) {
        setAnalysisError(apiData.error.message);
      } else {
        setAnalysisResult(apiData.choices[0].message.content.trim());
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalysisError("감정 분석 중 오류가 발생했습니다: " + err.message);
    }
  }, [AI_KEY]);

  // 감정 데이터 로딩 (선택된 아이가 있을 때)
  useEffect(() => {
    if (selectedChild) {
      const timeoutId = setTimeout(() => {
        const fetchEmotionData = async () => {
          try {
            console.log("selectedChild : ", selectedChild.childUserId);
            const data = await getChildEmotionData(Number(selectedChild.childUserId));
            setEmotionData(data);
            console.log("감정 데이터 : ", data);
            await analyzeEmotionData(data);
          } catch (error) {
            console.error("❌ 감정 데이터 불러오기 실패:", error);
            setAnalysisError("감정 데이터를 불러오는데 실패했습니다.");
          }
        };
        fetchEmotionData();
      }, 300);
  
      const timer = setTimeout(() => {
        const today = new Date();
        setCurrentMonth(today);
      }, 2000);
  
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(timer);
      };
    }
  }, [selectedChild, analyzeEmotionData]);

  const renderEmotionCard = () => (
    <div className="pa-card-right">
      <h3>감정 설명</h3>
      {analysisError ? (
        <p className="error-message">{analysisError}</p>
      ) : !analysisResult ? (
        <p>감정 분석 중...</p>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: analysisResult }} />
      )}
    </div>
  );

  // 달력에 예약된 날짜에 스타일을 추가하는 함수
  const highlightScheduledDatesInDOM = useCallback(
    (calendarSide) => {
      setTimeout(() => {
        let containerSelector, dates, baseDate;
        if (calendarSide === "left") {
          containerSelector = ".video-calendar-left";
          dates = videoDates1 || [];
          baseDate = dateVideo1;
        } else if (calendarSide === "right") {
          containerSelector = ".video-calendar-right";
          dates = videoDates2 || [];
          baseDate = dateVideo2;
        } else if (calendarSide === "chatbot") {
          containerSelector = ".chatbot-calendar";
          dates = chatBotDates || [];
          baseDate = dateChatBot;
        } else {
          console.error("highlightScheduledDatesInDOM: invalid calendarSide", calendarSide);
          return;
        }
    
        if (!Array.isArray(dates)) {
          console.error("highlightScheduledDatesInDOM: dates is not an array", dates);
          return;
        }
    
        const calendarCells = document.querySelectorAll(
          `${containerSelector} .p-datepicker td > span`
        );
        calendarCells.forEach((cell) => {
          const dateText = cell.innerText.padStart(2, "0");
          const selectedDate = `${baseDate.getFullYear()}-${String(
            baseDate.getMonth() + 1
          ).padStart(2, "0")}-${dateText}`;
          if (dates.includes(selectedDate)) {
            cell.classList.add("highlight-circle");
          }
        });
      }, 100);
    },
    [videoDates1, videoDates2, chatBotDates, dateVideo1, dateVideo2, dateChatBot]
  );

  // 달력의 월 변경 시 API 호출
  const handleMonthChange = (e, calendarType) => {
    const newDate = e.value;
    const newMonth = newDate.getMonth();
    
    if (calendarType === "chatbot" && newMonth !== prevChatBotMonth) {
      setDateChatBot(newDate);
      fetchChatBotDate(newDate);
      setPrevChatBotMonth(newMonth);
    } else if (calendarType === "video1" && newMonth !== prevVideoMonth1) {
      setDateVideo1(newDate);
      fetchVideoDates(newDate, 1);
      setPrevVideoMonth1(newMonth);
    } else if (calendarType === "video2" && newMonth !== prevVideoMonth2) {
      setDateVideo2(newDate);
      fetchVideoDates(newDate, 2);
      setPrevVideoMonth2(newMonth);
    }
  };

  // 챗봇 날짜 불러오기
  const fetchChatBotDate = useCallback(
    async (selectedDate) => {
      if (!selectedChild || !selectedChild.childUserId) return;
  
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
  
      try {
        console.log(`📅 ChatBot 데이터 가져오기: ${year}년 ${month}월, childId: ${selectedChild.childUserId}`);
        const response = await getChatBotDate(selectedChild.childUserId, year, month);
        const formattedDates = response.dateList.map((dateArr) => {
          const [year, month, day] = dateArr;
          const formattedMonth = String(month).padStart(2, "0");
          const formattedDay = String(day).padStart(2, "0");
          return `${year}-${formattedMonth}-${formattedDay}`;
        });
        setChatBotDates(formattedDates);
      } catch (error) {
        console.error("❌ ChatBot 데이터 불러오기 실패:", error);
      }
    },
    [selectedChild]
  );

  // 학습 영상 날짜 불러오기
  const fetchVideoDates = useCallback(
    async (selectedDate, calendarIndex) => {
      if (!selectedChild || !selectedChild.childUserId) return;
  
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
  
      try {
        console.log(`📅 학습 영상 날짜 가져오기: ${year}년 ${month}월, childId: ${selectedChild.childUserId}`);
        const response = await getVideoDate(selectedChild.childUserId, year, month);
    
        const formattedDates = response.dateList.map((dateArr) => {
          const [year, month, day] = dateArr;
          const formattedMonth = String(month).padStart(2, "0");
          const formattedDay = String(day).padStart(2, "0");
          return `${year}-${formattedMonth}-${formattedDay}`;
        });
    
        if (calendarIndex === 1) {
          setVideoDates1(formattedDates || []);
        } else {
          setVideoDates2(formattedDates || []);
        }
      } catch (error) {
        console.error(`❌ 학습 영상 ${calendarIndex} 데이터 불러오기 실패:`, error);
      }
    },
    [selectedChild]
  );

  // 챗봇, 영상 날짜 로딩 (선택된 아이가 있을 때)
  useEffect(() => {
    if (selectedChild) {
      fetchChatBotDate(dateChatBot);
      fetchVideoDates(dateVideo1, 1);
      fetchVideoDates(dateVideo2, 2);
    }
  }, [selectedChild, dateChatBot, dateVideo1, dateVideo2, fetchChatBotDate, fetchVideoDates]);

  useEffect(() => {
    setTimeout(() => {
      highlightScheduledDatesInDOM("chatbot");
    }, 300);
  }, [chatBotDates, dateChatBot, highlightScheduledDatesInDOM]);

  useEffect(() => {
    setTimeout(() => {
      highlightScheduledDatesInDOM("left");
    }, 300);
  }, [videoDates1, currentMonth, highlightScheduledDatesInDOM]);

  useEffect(() => {
    setTimeout(() => {
      highlightScheduledDatesInDOM("right");
    }, 300);
  }, [videoDates2, currentMonth, highlightScheduledDatesInDOM]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const today = new Date();
      setCurrentMonth(today);
    }, 2000);
    return () => clearTimeout(timer);
  }, [dateChatBot]);

  const handleViewDateChangeForChatBot = (e) => {
    handleMonthChange(e, "chatbot");
    setCurrentMonth(e.value);
  };
  const handleViewDateChangeForVideo1 = (e) => {
    handleMonthChange(e, "video1");
    setCurrentMonth(e.value);
  };
  const handleViewDateChangeForVideo2 = (e) => {
    handleMonthChange(e, "video2");
    setCurrentMonth(e.value);
  };

  // 영상 조회 버튼 핸들러
  const handleVideoSearch = () => {
    const formatDate = (date) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
  
    const formattedDateVideo1 = formatDate(dateVideo1);
    const formattedDateVideo2 = formatDate(dateVideo2);
    const childUserId = selectedChild ? selectedChild.childUserId : "";
    
    const queryParams = `?dateVideo1=${formattedDateVideo1}&dateVideo2=${formattedDateVideo2}&childUserId=${childUserId}`;
  
    window.open(
      "/counselor/child/video/multiple" + queryParams,
      "_blank",
      `left=0,top=0,width=${screen.width},height=${screen.height}`
    );
  };

  return (
    <div className="pa-page">
      <CounselorHeader />

      {/* 감정 분석 영역 */}
      <div className="pa-container">
        <div className="pa-title">
          {/* 드롭다운 대신 useUserStore에서 가져온 아이의 이름을 표시 */}
          <div className="pa-child-info">
            {selectedChild ? selectedChild.childUserName : "아동 정보 없음"}
          </div>
          <span>감정이의 학습 데이터</span>
        </div>

        {/* 감정 분석 섹션 */}
        <div className="pa-section">
          <h3>감정 분석</h3>
          <div className="pa-analysis-container">
            <div className="pa-card-left">
              <h3>통계</h3>
              <div className="pa-radar-chart">
                <Chart
                  type="radar"
                  data={{
                    labels: ["기쁨", "슬픔", "화남", "공포", "놀람"],
                    datasets: [
                      {
                        label: "종합 점수",
                        data: emotionData
                          ? [
                              emotionData["1"].rating,
                              emotionData["2"].rating,
                              emotionData["3"].rating,
                              emotionData["4"].rating,
                              emotionData["5"].rating,
                            ]
                          : [0, 0, 0, 0, 0],
                        backgroundColor: "rgba(61, 126, 235, 0.3)",
                        borderColor: "#3D7EEB",
                        borderWidth: 2,
                        pointBackgroundColor: "#3D7EEB",
                        pointBorderColor: "#fff",
                        pointRadius: 4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      r: {
                        min: 0,
                        angleLines: { display: false },
                        grid: { display: true, color: "#ddd" },
                        ticks: { display: true },
                      },
                    },
                  }}
                  style={{ width: "260px", height: "260px" }}
                />
              </div>
            </div>
            {renderEmotionCard()}
          </div>
        </div>
      </div>

      <div className="pa-container">
        {/* 게임 분석 섹션 */}
        <div className="pa-section">
          <h3>게임 분석</h3>
          <div className="pa-game-wrapper">
            <button
              className="pa-stage-btn left"
              onClick={() => currentStage > 1 && setCurrentStage(currentStage - 1)}
              disabled={currentStage === 1}
            >
              ◀
            </button>

            <div className="pa-game-analysis">
              {[currentStage, currentStage + 1].map((stage) => {
                const stageData = emotionData ? {
                  chartData: {
                    labels: ["기쁨", "슬픔", "화남", "공포", "놀람"],
                    datasets: [
                      {
                        label: "정답률",
                        data: [
                          emotionData["1"][`stageCrtRate${stage}`],
                          emotionData["2"][`stageCrtRate${stage}`],
                          emotionData["3"][`stageCrtRate${stage}`],
                          emotionData["4"][`stageCrtRate${stage}`],
                          emotionData["5"][`stageCrtRate${stage}`],
                        ],
                        backgroundColor: ["#7DA1FF", "#FF7A7A", "#3C72E3", "#FFB85F", "#7A7AFF"],
                        borderRadius: 5,
                      },
                    ],
                  },
                } : null;

                const hasData = !!stageData;
                const getMainAndSubEmotion = (stageData) => {
                  if (!stageData) return { mainEmotions: ["-"], subEmotions: [] };
                  const emotions = [
                    { label: "기쁨", value: stageData.chartData.datasets[0].data[0] },
                    { label: "슬픔", value: stageData.chartData.datasets[0].data[1] },
                    { label: "화남", value: stageData.chartData.datasets[0].data[2] },
                    { label: "공포", value: stageData.chartData.datasets[0].data[3] },
                    { label: "놀람", value: stageData.chartData.datasets[0].data[4] },
                  ];
                  const uniqueValues = new Set(emotions.map(e => e.value));
                  if (uniqueValues.size === 1) {
                    return { mainEmotions: emotions.map(e => e.label), subEmotions: [] };
                  }
                  emotions.sort((a, b) => b.value - a.value);
                  const maxValue = emotions[0].value;
                  const minValue = emotions[emotions.length - 1].value;
                  return {
                    mainEmotions: emotions.filter(e => e.value === maxValue).map(e => e.label),
                    subEmotions: emotions.filter(e => e.value === minValue).map(e => e.label),
                  };
                };

                return (
                  <div key={stage} className="pa-game-card">
                    <h3>{stage}단계</h3>
                    <div className="pa-chart" style={{ minHeight: "250px" }}>
                      {hasData ? (
                        <Chart
                          type="bar"
                          data={stageData.chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                              x: { ticks: { color: "#666" }, grid: { color: "#ddd" } },
                              y: { suggestedMax: 13, ticks: { color: "#666", stepSize: 1 }, grid: { color: "#ddd" } },
                            },
                          }}
                          style={{ height: "400px", width: "80%" }}
                        />
                      ) : (
                        <div className="pa-no-data">데이터 생성 전</div>
                      )}
                    </div>
                    {hasData ? (
                      (() => {
                        const { mainEmotions, subEmotions } = getMainAndSubEmotion(stageData);
                        return (
                          <p>
                            <b>주요 감정:</b> {mainEmotions.length > 0 ? mainEmotions.join(", ") : ""} <br />
                            <b>보완 감정:</b> {subEmotions.length > 0 ? subEmotions.join(", ") : ""}
                          </p>
                        );
                      })()
                    ) : (
                      <p>
                        <b>주요 감정:</b> <br />
                        <b>보완 감정:</b>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              className="pa-stage-btn right"
              onClick={() => currentStage < 4 && setCurrentStage(currentStage + 1)}
              disabled={currentStage >= 4}
            >
              ▶
            </button>
          </div>
        </div>

        {/* 감정 일기 섹션 */}
        <div className="pa-section">
          <h3>감정 일기</h3>
          <div className="pa-diary-container">
            <div className="chatbot-calendar pa-diary-calendar">
              <Calendar
                value={dateChatBot}
                onChange={(e) => setDateChatBot(e.value)}
                showIcon
                style={{ width: "340px", marginBottom: "5px" }}
                appendTo="self"
                onViewDateChange={handleViewDateChangeForChatBot}
                onShow={() => fetchChatBotDate(dateChatBot)}
              />
            </div>
            <ChatBotData selectedDate={dateChatBot} selectedChild={selectedChild} />
          </div>
        </div>

        {/* 학습 영상 조회 섹션 */}
        <div className="pa-section">
          <h3>학습 영상 조회</h3>
          <div className="pa-videos-container">
            <div className="pa-videos-calendar">
              <div className="video-calendar-left">
                <Calendar
                  value={dateVideo1}
                  onChange={(e) => setDateVideo1(e.value)}
                  inline
                  onViewDateChange={handleViewDateChangeForVideo1}
                  style={{ width: "100%" }}
                  appendTo="self"
                />
              </div>
              <div className="video-calendar-right">
                <Calendar
                  value={dateVideo2}
                  onChange={(e) => setDateVideo2(e.value)}
                  inline
                  onViewDateChange={handleViewDateChangeForVideo2}
                  style={{ width: "100%" }}
                  appendTo="self"
                />
              </div>
            </div>
            <div className="button-wrapper">
              <button className="pa-button" onClick={handleVideoSearch}>
                영상 조회
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CounselorChildrenDataPage;
