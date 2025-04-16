import { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useLocation } from 'react-router-dom';
import { getVideoDate, getVideoCount } from "/src/api/childData";
import { getFileUrl } from "/src/api/file";
import "/src/pages/Parent/ParentCss/ParentVideoMultiplePage.css";

function CounselorVideoMultiplePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // URL 쿼리 파라미터에서 childUserId 및 날짜를 읽어옴
  const childUserId = params.get('childUserId') || "";
  const getInitialDate = (paramName) => {
    const dateStr = params.get(paramName); // "YYYY-MM-DD"
    if (dateStr) {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day); // 로컬 타임존 기준으로 생성
    }
    return new Date();
  };

  // 두 달력의 선택된 날짜 (왼쪽: dateVideo1, 오른쪽: dateVideo2)
  const [dates, setDates] = useState([
    getInitialDate('dateVideo1'),
    getInitialDate('dateVideo2')
  ]);
  const [emotions, setEmotions] = useState([null, null]);
  const [selectedVideos, setSelectedVideos] = useState([null, null]);

  // API 호출 결과를 저장할 상태 (각 달력에 해당하는 "YYYY-MM-DD" 형식의 문자열 배열)
  const [videoDates1, setVideoDates1] = useState([]);
  const [videoDates2, setVideoDates2] = useState([]);
  // 각 달력(왼쪽, 오른쪽) 영상 옵션을 저장할 state
  const [videoOptions1, setVideoOptions1] = useState([]);
  const [videoOptions2, setVideoOptions2] = useState([]);
  // 선택한 회차에 해당하는 파일 URL을 저장할 state (각각 왼쪽, 오른쪽)
  const [videoUrls, setVideoUrls] = useState([null, null]);

  // tryIndex에 따른 label 생성 헬퍼 함수
  const getLabel = (tryIndex) => {
    const labels = ["첫번째 시도", "두번째 시도", "세번째 시도", "네번째 시도", "다섯번째 시도", "여섯번째 시도"];
    return labels[tryIndex] || `${tryIndex + 1}번째 시도`;
  };

  const emotionOptions = [
    { label: '기쁨', value: '1' },
    { label: '슬픔', value: '2' },
    { label: '놀람', value: '3' },
    { label: '화남', value: '4' },
    { label: '공포', value: '5' }
  ];

  // API에서 받은 데이터의 dateList를 "YYYY-MM-DD" 문자열 배열로 변환하는 함수
  const getFormattedDates = (data) => {
    return data.dateList.map(dateArr => {
      const [year, month, day] = dateArr;
      const formattedMonth = String(month).padStart(2, '0');
      const formattedDay = String(day).padStart(2, '0');
      return `${year}-${formattedMonth}-${formattedDay}`;
    });
  };

  // 달력 오버레이(팝업)에 highlight를 적용하는 함수
  const highlightDates = useCallback((baseDate, formattedDates) => {
    setTimeout(() => {
      const overlay = document.body.querySelector('.p-datepicker');
      if (!overlay) return;
      const dateCells = overlay.querySelectorAll('td > span');
      dateCells.forEach(cell => {
        // 셀의 텍스트를 두 자리 문자열로 만듦 (예: "1" → "01")
        const dayText = cell.innerText.padStart(2, '0');
        const year = baseDate.getFullYear();
        const month = String(baseDate.getMonth() + 1).padStart(2, '0');
        const cellDateStr = `${year}-${month}-${dayText}`;
        if (formattedDates.includes(cellDateStr)) {
          cell.classList.add("highlight");
        } else {
          cell.classList.remove("highlight");
        }
      });
    }, 100);
  }, []);

  // 날짜 변경 또는 달이 바뀔 때 API를 호출해 날짜 데이터를 받아오고 highlight 적용 (왼쪽 달력)
  useEffect(() => {
    if (childUserId) {
      const year = dates[0].getFullYear();
      const month = dates[0].getMonth() + 1; // 1~12
      getVideoDate(childUserId, year, month)
        .then(response => {
          const formatted = getFormattedDates(response);
          setVideoDates1(formatted);
          highlightDates(dates[0], formatted);
        })
        .catch(error => {
          console.error("❌ 왼쪽 비디오 날짜 불러오기 실패:", error);
        });
    }
  }, [childUserId, dates, highlightDates]);

  // 날짜 변경 또는 달이 바뀔 때 API를 호출해 날짜 데이터를 받아오고 highlight 적용 (오른쪽 달력)
  useEffect(() => {
    if (childUserId) {
      const year = dates[1].getFullYear();
      const month = dates[1].getMonth() + 1;
      getVideoDate(childUserId, year, month)
        .then(response => {
          const formatted = getFormattedDates(response);
          setVideoDates2(formatted);
          highlightDates(dates[1], formatted);
        })
        .catch(error => {
          console.error("❌ 오른쪽 비디오 날짜 불러오기 실패:", error);
        });
    }
  }, [childUserId, dates, highlightDates]);

  // 왼쪽 달력에 대한 영상 옵션 업데이트
  useEffect(() => {
    if (childUserId && dates[0] && emotions[0]) {
      const formattedDate = dates[0].toISOString().split("T")[0];
      const stageId = emotions[0];
      getVideoCount(childUserId, formattedDate, stageId)
        .then((response) => {
          const newOptions = response.map((item) => ({
            label: getLabel(item.tryIndex),
            value: item.gameLogId,
          }));
          if (newOptions.length === 0) {
            setVideoOptions1([{ label: "데이터 없음", value: "" }]);
          } else {
            setVideoOptions1(newOptions);
          }
        })
        .catch((error) => {
          console.error("❌ 왼쪽 영상 개수 가져오기 실패:", error);
        });
    }
  }, [childUserId, dates[0], emotions[0]]);

  // 오른쪽 달력에 대한 영상 옵션 업데이트
  useEffect(() => {
    if (childUserId && dates[1] && emotions[1]) {
      const formattedDate = dates[1].toISOString().split("T")[0];
      const stageId = emotions[1];
      getVideoCount(childUserId, formattedDate, stageId)
        .then((response) => {
          const newOptions = response.map((item) => ({
            label: getLabel(item.tryIndex),
            value: item.gameLogId,
          }));
          if (newOptions.length === 0) {
            setVideoOptions2([{ label: "데이터 없음", value: "" }]);
          } else {
            setVideoOptions2(newOptions);
          }
        })
        .catch((error) => {
          console.error("❌ 오른쪽 영상 개수 가져오기 실패:", error);
        });
    }
  }, [childUserId, dates[1], emotions[1]]);

  // onMonthChange 이벤트 핸들러: 달이 바뀌면 해당 달의 1일로 업데이트하고 API 재호출 + highlight 적용
  const handleMonthChange = (index, e) => {
    const { month, year } = e; // month: 0부터 시작 (0 = 1월)
    const firstDayOfNewMonth = new Date(year, month, 1);
    const newDates = [...dates];
    newDates[index] = firstDayOfNewMonth;
    setDates(newDates);

    // 새 달에 대해 API 호출 (month+1: 1~12)
    getVideoDate(childUserId, year, month + 1)
      .then(response => {
        const formatted = getFormattedDates(response);
        if (index === 0) {
          setVideoDates1(formatted);
        } else {
          setVideoDates2(formatted);
        }
        highlightDates(firstDayOfNewMonth, formatted);
      })
      .catch(error => {
        console.error(`❌ ${index === 0 ? "왼쪽" : "오른쪽"} 비디오 날짜 불러오기 실패:`, error);
      });
  };

  return (
    <div className="video-page-container">
      <h1 className="page-title">학습 영상 조회</h1>
      <div className="videos-container-m">
        {[0, 1].map((index) => (
          <div key={index} className="video-section-m">
            <div className="controls-row-m">
              <div className="control-item date-picker-m">
                <label>날짜 선택</label>
                <div>
                  <Calendar
                    value={dates[index]}
                    onChange={(e) => {
                      const newDates = [...dates];
                      newDates[index] = e.value;
                      setDates(newDates);
                    }}
                    onMonthChange={(e) => handleMonthChange(index, e)}
                    showMonthNavigator
                    showYearNavigator
                    appendTo={document.body}
                    onShow={() => {
                      const formatted = index === 0 ? videoDates1 : videoDates2;
                      highlightDates(dates[index], formatted);
                    }}
                    className="simple-calendar"
                    placeholder="날짜를 선택하세요"
                    dateFormat="yy년/mm월/dd일"
                  />
                </div>
              </div>
              
              <div className="control-item emotion-picker-m">
                <label>감정 선택</label>
                <Dropdown
                  value={emotions[index]}
                  options={emotionOptions}
                  onChange={(e) => {
                    const newEmotions = [...emotions];
                    newEmotions[index] = e.value;
                    setEmotions(newEmotions);
                  }}
                  placeholder="감정"
                  className="dropdown-input"
                />
              </div>
              
              <div className="control-item video-picker-m">
                <label>회차 선택</label>
                <Dropdown
                  value={selectedVideos[index]}
                  options={index === 0 ? videoOptions1 : videoOptions2}
                  onChange={(e) => {
                    const newVideos = [...selectedVideos];
                    newVideos[index] = e.value;
                    setSelectedVideos(newVideos);
                    console.log(`선택한 회차 아이디 (${index}): ${e.value}`);
                    // tblType은 "G"로 고정, tblId는 선택된 회차 아이디 (gameLogId)
                    getFileUrl("G", Number(e.value))
                      .then((data) => {
                        // data가 배열 형태로 반환될 경우 첫 번째 요소의 url 사용
                        const url = Array.isArray(data) && data.length > 0 ? data[0].url : "";
                        setVideoUrls(prev => {
                          const updated = [...prev];
                          updated[index] = url;
                          return updated;
                        });
                        console.log(`회차 ${index}의 파일 URL:`, url);
                      })
                      .catch((error) => {
                        console.error("파일 URL 조회 실패:", error);
                      });
                  }}
                  placeholder="회차 선택"
                  className="dropdown-input"
                />
              </div>
            </div>
            
            <div className="video-container-m">
              { videoUrls[index] ? (
                <video 
                src={videoUrls[index]} 
                controls 
                autoPlay 
                style={{ 
                  height: "100%", 
                  width: "100%", 
                  objectFit: "cover" 
                }} 
              />              
              ) : (
                <img 
                  src="/noVideo.png" 
                  alt={`Video ${index + 1}`} 
                  className="video-placeholder" 
                />
              ) }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CounselorVideoMultiplePage;