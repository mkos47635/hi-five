import "./ChildCss/ChildReviewGamePage.css";
import useGameStore from "../../store/gameStore";
import { limitGamedata } from "../../api/childGameContent";
import { useEffect, useState, useRef, useCallback } from "react";
import { Card } from "primereact/card";
import * as faceApi from "face-api.js";
import stringSimilarity from "string-similarity";
import SwAl from "sweetalert2";
import { OpenVidu } from 'openvidu-browser';
import api from "../../api/api";
import CounselorCamWithChild from "../../components/OpenviduSession/CounselorCamWithChild";
import Webcam from "react-webcam";
import {sendAlarm} from "../../api/alarm.jsx";
import {endChapter, saveGameData, startChapter, startStage, updateChildStage} from "../../api/childGame";
import {TBL_TYPES, uploadFile} from "../../api/file";
import { ProgressBar } from "primereact/progressbar";

function ChildClassPage() {
  // react-webcam의 ref (내부 video 엘리먼트는 ref.current.video)
  const webcamRef = useRef(null);
  // OpenVidu 관련 ref
  const videoRef = useRef(null);
  const analysisIntervalRef = useRef(null);
  const analysisDataRef = useRef([]);

  const childId = sessionStorage.getItem("childId");
  const { setChapterAndStage} = useGameStore();
  const [, setGameState] = useState(null);
  const [, setGameIdData] = useState(null);
  const [, setIsLoading] = useState(true);
  const [currentGameData, setCurrentGameData] = useState(null);
  const [phase, setPhase] = useState("video");
  const [showContent, setShowContent] = useState(false);
  const [currentVideoIndex] = useState(0);
  const [, setIsPlaying] = useState(false);
  const [faceResult, setFaceResult] = useState(null);
  const [voiceResult, setVoiceResult] = useState(null);
  const [analysisCycle, setAnalysisCycle] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [, setAnalysisReady] = useState(false);
  const [session, setSession] = useState(null);
  const [subscriber, setSubscriber] = useState([]);
  const [, setPublisher] = useState(null);
  const OV = useRef(new OpenVidu());
  const [isStart, setIsStart] = useState(false);
  const recognitionRef = useRef(null);
  const analysisCanceledRef = useRef(false)
  const [bestMatchResult, setBestMatchResult] = useState(null);

  const [childGameChapterId, setChildGameChapterId] = useState(null);
  const [childGameStageId, setChildGameStageId] = useState(null);
  const [gameLogId, setGameLogId] = useState(null);
  const [gameVideoBlob, setGameVideoBlob] = useState(null);


  // --------------------------------------------------------- //
  // 페이지 마운트 및 세션 초기화, 게임 에셋, AI 모델 로드            //
  // --------------------------------------------------------- //
  // --- 0. 오픈비두 토큰 받기 -------------------------
  async function getToken() {
    try {
      const response = await api.post('/session/join', {
        type: 'game',
        childId
      });
      return response.data;
    } catch (error) {
      console.error('토큰 요청 실패:', error);
      throw error;
    }
  }

  // --- 1. 세션 초기화 -------------------------
  const initializeSession = useCallback(async () => {
    try {
      const sessionInstance = OV.current.initSession();

      sessionInstance.on("streamCreated", (event) => {
        const subscriber = sessionInstance.subscribe(event.stream, undefined);
        setSubscriber(subscriber);
      });

      sessionInstance.on('streamDestroyed', () => {
        setSubscriber(null);  // null로 초기화
      });

      const token = await getToken();
      // 토큰을 통해 세션과 스트림구독을 연결
      await sessionInstance.connect(token);

      // 화면 공유 퍼블리셔 생성 (child는 화면 공유만 OpenVidu로 publish)
      const pub = OV.current.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: "screen",
        publishAudio: true,
        publishVideo: true,
        mirror: true,
      });

      await sessionInstance.publish(pub);
      setSession(sessionInstance);
      setPublisher(pub);
    } catch (error) {
      console.error('세션 초기화 오류:', error);
    }
  }, []);

  // --- 2. 컴포넌트 마운트 시 세션 초기화 -------------------------
  useEffect(() => {
    initializeSession();
    return () => {
      if (session) session.disconnect();
    };
  }, []);
  // --- 3. API를 통해 동영상 데이터 로드 ----------------
  useEffect(() => {
    const fetchLimitData = async () => {
      try {
        const data = await limitGamedata(childId);
        setGameIdData("가져온 정보", data);
        if (data) {
          await useGameStore.getState().fetchChapterData(data.chapter);
          setChapterAndStage(data.chapter, data.stage);
          const currentState = useGameStore.getState();
          setGameState(currentState);
        }
        const gameData = useGameStore.getState().getCurrentGameData();
        setCurrentGameData(gameData);
      } catch (error) {
        console.error("[fetchLimitData] 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLimitData();
  }, [childId]);

  // --- 4. face-api 모델 로드 ---
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceApi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceApi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceApi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceApi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
    };
    loadModels();
  }, []);
  // --- 5. 시작 버튼 누른 후 모달 실행 ---------------------
  useEffect(() => {
    if (!isStart) {
      SwAl.fire({
        title: "상담사 선생님을 기다리고 있어요!",
        imageUrl: "/child/character/againCh.png",
        imageWidth: 200,
        imageHeight: 200,
        showConfirmButton: false,
      });
    }
    if (isStart) {
      setShowContent(true);
    }
  }, [isStart, showContent]);


  // --------------------------------------------------------- //
  // 게임 로직                                                   //
  // --------------------------------------------------------- //

  // --- 1. phase가 "video"이고 showContent가 true일 때 동영상 자동 재생 -------
  useEffect(() => {
    if (phase === "video" && currentGameData && videoRef.current && showContent) {
      videoRef.current
          .play()
          .then(() => {
          })
          .catch((error) => {
            console.error("자동 재생 실패:", error);
          });
    }
  }, [phase, currentGameData, showContent]);

  // --- 2. 비디오 종료 ----------------------------
  const handleVideoEnd = () => {
    SwAl.fire({
      title: "상황에 어울리는 옳은 감정과 말은 무엇일까요?",
      imageUrl: "/child/character/againCh.png",
      imageWidth: 200,
      imageHeight: 200,
      timer: 2000,
      showConfirmButton: false,
    }).then();
    setAnalysisCycle(1);
  };

  // --- 3. 녹화 시작 (분석까지) --------------------
  const startRecording = async () => {
    try {
      if (webcamRef.current && webcamRef.current.video) {
        // react-webcam의 video 엘리먼트에서 스트림 가져오기
        const stream = webcamRef.current.video.srcObject;
        if (!stream) {
          console.error("웹캠 스트림이 없습니다.");
          return;
        }
        // 스트림 클론 (분석용으로 별도 처리)
        const clonedStream = stream.clone();
        const mediaRecorder = new MediaRecorder(clonedStream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          if (analysisCycle < 3) {
            const blob = new Blob(chunks, { type: "video/webm" });
            setGameVideoBlob(blob);
          }
        };

        mediaRecorder.start();
        setRecorder(mediaRecorder);
        setIsRecording(true);
        // 분석 시작
        setPhase("analysis");
        if ([1, 2].includes(analysisCycle)) {
          runConcurrentAnalysis();
        } else if (analysisCycle === 3) {
          runFaceAnalysis();
        } else if (analysisCycle === 4) {
          runVoiceAnalysis();
        }
      }
    } catch (error) {
      console.error("녹화 및 분석 시작 중 오류:", error);
    }
  };

  // --- 4. 녹화 중지 및 분석 결과 도출 ------------------
  const stopRecording = async () => {
    try {
      if (recorder) {
        recorder.stop();
        setIsRecording(false);
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
      setPhase("analysisResult");
    } catch (error) {
      console.error("녹화 및 분석 중지 오류:", error);
      SwAl.fire({
        title: "오류 발생",
        text: "분석 중 문제가 발생했습니다. 다시 시도해주세요.",
        icon: "error",
      });
    }
  }

  // 영상 전송
  useEffect(() => {
    try {
      console.log("gameLogId: ", gameLogId);
      sendGameVideo(gameVideoBlob);
    } catch (uploadError) {
      console.error("파일 업로드 실패:", uploadError);
    }
  }, [gameLogId]);

  // --- 5. 분석 결과 도출 ------------------
  useEffect( () => {
    if (phase === "analysisResult" && faceResult && voiceResult) {
      showAnalysisResultModal();
    } else if (phase === "analysisResult" && faceResult) {
      showAnalysisResultModal();
    } else if (phase === "analysisResult" && voiceResult) {
      showAnalysisResultModal();
    }
  }, [faceResult, voiceResult, phase, analysisCycle]);

  // --- 5. 정답 제출 (분석 결과) 및 연습 단계 ---------------
  // 현재 analysisCycle에 따라 적절한 모달 호출
  const showAnalysisResultModal = () => {
    switch (analysisCycle) {
      case 1:
      case 2:
        showAfterSubmitModal().then(() => sendGameData());
        break;
      case 3:
        showFacePracticeModal();
        break;
      case 4:
        showVoicePracticeModal();
        break;
      case 5:
        showCardRewardModal();
        break;
      default:
        break;
    }
  };

  // 공통 헬퍼: Swal 모달 호출
  const showSwalModal = ({
                           title = "",
                           text = "",
                           html = "",
                           imageUrl = "/child/character/againCh.png",
                           imageWidth = 200,
                           imageHeight = 200,
                           timer = 2000,
                           showConfirmButton = false,
                           allowOutsideClick = true,
                           didOpen = null,
                           icon = null,
                         }) => {
    return SwAl.fire({
      title,
      text,
      html,
      imageUrl,
      imageWidth,
      imageHeight,
      timer,
      showConfirmButton,
      allowOutsideClick,
      didOpen,
      icon,
    });
  };

  // 정답 제출 후 다음 연습 모달 호출 (Cycle 2 또는 3)
  const showBeforeSubmitModal = (nextCycle) => {
    const modalOptions = {
      3: {
        title: "이제 표정 연습을 해볼까요?",
        text: "거울을 보면서 천천히 따라해보세요!",
        logMessage: "[analysisModal] 표정 연습 모달 완료, cycle 변경 -> 3",
      },
      2: {
        title: "한 번 더 정답을 맞춰보세요!",
        text: "다시 한 번 표정과 말을 해보세요!",
        logMessage: "[analysisModal] 다시 연습 모달 완료, cycle 변경 -> 2",
      },
    };

    const options = modalOptions[nextCycle];
    if (!options) return;

    showSwalModal({
      title: options.title,
      text: options.text,
    }).then(() => {
      setAnalysisCycle(nextCycle);
      setFaceResult(null);
      setVoiceResult(null);
      setPhase("analysisModal");
    });
  };

  // 정답 제출 모달 (Cycle 1,2)
  const showAfterSubmitModal = async () => {
    if (![1, 2].includes(analysisCycle)) return;
  
    // 영어 감정 값을 한글로 매핑하는 객체
    const faceResultMap = {
      happy: "행복",
      sad: "슬픔",
      angry: "화남",
      fearful: "공포",
      surprised: "놀람"
    };
  
    // faceResult를 한글로 변환 (매핑이 없으면 원본 값 사용)
    const displayFaceResult = faceResultMap[faceResult] || faceResult;
  
    showSwalModal({
      title: "현재 감정이의 표현은?",
      html: `
        <h4>표정: ${displayFaceResult}</h4>
        <h4>목소리: ${voiceResult}</h4>
      `,
    }).then(async () => {
      if (analysisCycle === 1) {
        if (faceResult.includes("좋아요") && voiceResult.includes("좋아요")) {
          showBeforeSubmitModal(3);
        } else {
          showBeforeSubmitModal(2);
        }
      } else if (analysisCycle === 2) {
        showBeforeSubmitModal(3);
      }
    });
  };
  



  // Cycle 3: 표정 분석 결과 후 음성 연습 안내
  const showFacePracticeModal = () => {
    showSwalModal({
      title: "감정이의 표정",
      html: `<p>${faceResult}</p>`,
    }).then(() => {
      showSwalModal({
        title: "이제 말 연습을 해볼까요?",
        text: "아래 글자를 천천히 따라해보세요!",
      }).then(() => {
        setAnalysisCycle(4); // 음성 연습 단계로 전환
        setFaceResult(null);
        setPhase("analysisModal");
      });
    });
  };

  // Cycle 4: 음성 분석 결과 모달 (추가 동작 필요 시 확장)
  const showVoicePracticeModal = () => {
    showSwalModal({
      title: "감정이의 목소리",
      html: `<p>${voiceResult}</p>`,
    }).then(() => {
      setAnalysisCycle(5); // 카드 보상 단계로 전환
      setFaceResult(null);
      setPhase("analysisModal");
    });
  };

  // Cycle 5: 카드 보상 모달 헬퍼 호출
  useEffect(() => {
    if (analysisCycle === 5) {
      showAnalysisResultModal();
    }
  }, [analysisCycle]);

  // Cycle 5: 카드 보상 모달 체인 (정답 여부에 따라 첫 모달 메시지 분기)
  const showCardRewardModal = () => {
    const firstModalOptions = { title: "보상 카드가 도착했어요!", icon: "success" };

    // 1. 첫 모달: 2초 타이머 후 자동 진행
    SwAl.fire({
      ...firstModalOptions,
      timer: 2000,
      showConfirmButton: false,
      allowOutsideClick: false,
    }).then(() => {

      // 2. 카드 보상 모달: 카드 플립 애니메이션 포함 HTML 표시
      SwAl.fire({
        html: `
        <style>
          .flip-card {
            perspective: 1000px;
            width: 200px;
            height: 300px;
            margin: 0 auto;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
          }
          .flip-card-back {
            transform: rotateY(180deg);
          }
        </style>
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <img src="${currentGameData.cardFront}" alt="card front" style="width: 200px; height: 300px; object-fit: contain;" />
            </div>
            <div class="flip-card-back">
              <img src="${currentGameData.cardBack}" alt="card back" style="width: 200px; height: 300px; object-fit: contain;" />
            </div>
          </div>
        </div>
      `,
        showConfirmButton: false,
        timer: 2000,
        didOpen: () => {
          // 4초 후 카드 뒤집기 애니메이션 실행
          setTimeout(() => {
            const card = document.querySelector(".flip-card-inner");
            if (card) card.style.transform = "rotateY(180deg)";
          }, 4000);
        },
      }).then(() => {
        showFinalModal();
      });
    });
  };

  // 마지막 모달
  const showFinalModal = async () => {
    if (currentGameData.gameStageId === 5) {
      await showSwalModal({
        title: "정말 잘했어요!",
        text: "모든 단원을 완료했어요!",
      });
      await sendEndChapter();
      await sendUpdateChildStage();
    } else {
      await showSwalModal({
        title: "정말 잘했어요!",
        text: "다음 단원으로 이동할까요?",
      });
      await nextChapter();
      setAnalysisCycle(1);
      setFaceResult(null);
      setVoiceResult(null);
      setPhase("video");
    }
  };


  // --------------------------------------------------------- //
  // AI 분석                                                    //
  // --------------------------------------------------------- //
  // ---1. 평균 감정 계산 함수 ------------------
  const computeAverageEmotion = (data) => {
    let sum = {
      neutral: 0,
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
    };
    let count = 0;
    data.forEach((item) => {
      item.emotions.forEach((emotionObj) => {
        Object.keys(sum).forEach((key) => {
          sum[key] += emotionObj[key] || 0;
        });
        count++;
      });
    });
    if (count === 0) {
      return null;
    }
    let avg = {};
    Object.keys(sum).forEach((key) => {
      avg[key] = sum[key] / count;
    });
    return avg;
  };

  // --- 동시 분석 (표정 + 음성) ------------------
  const runConcurrentAnalysis = async () => {

    // 표정 분석 Promise (9초간 분석)
    const facePromise = new Promise((resolve) => {
      analysisDataRef.current = [];

      const intervalId = setInterval(async () => {

        if (webcamRef.current && webcamRef.current.video) {
          const videoElement = webcamRef.current.video;
          const detections = await faceApi
              .detectAllFaces(videoElement, new faceApi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();
          // 검출 결과 처리
          if (detections.length > 0) {
            const emotions = detections.map((det) => det.expressions);
            analysisDataRef.current.push({
              timestamp: new Date().toISOString(),
              emotions,
            });
          }
        }
      }, 100);
      analysisIntervalRef.current = intervalId;

      setTimeout(() => {
        clearInterval(intervalId);
        analysisIntervalRef.current = null;

        const avgEmotion = computeAverageEmotion(analysisDataRef.current);
        if (!avgEmotion) {
          resolve("표정 분석 실패");
          return;
        }
        const candidates = ["happy", "sad", "angry", "fearful", "surprised"];
        const candidateAverages = candidates.map((emotion) => ({
          emotion,
          value: avgEmotion[emotion] || 0,
        }));
        candidateAverages.sort((a, b) => b.value - a.value);
        const bestEmotion = candidateAverages[0].emotion;
        const expectedEmotions = ["happy", "sad", "angry", "fearful", "surprised"];
        const expectedEmotion = expectedEmotions[currentVideoIndex] || "없음";
        const emotionMap = {
          happy: "행복",
          sad: "슬픔",
          angry: "화남",
          fearful: "공포",
          surprised: "놀람"
        };
        
        const displayExpectedEmotion = emotionMap[expectedEmotion] || expectedEmotion;
        
        const resultMsg =
          bestEmotion === expectedEmotion
            ? `표현력이 좋아요!`
            : `아쉬워요! 정답은 "${displayExpectedEmotion}" 이에요!`;
        resolve(resultMsg);
        
      }, 9000);
    });

    // 음성 인식 Promise
    const voicePromise = new Promise((resolve, reject) => {
      if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        reject("이 브라우저는 Speech Recognition을 지원하지 않습니다.");
        return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      // 음성 인식 인스턴스를 ref에 저장
      recognitionRef.current = recognition;

      recognition.lang = "ko-KR";
      recognition.interimResults = false;
      recognition.continuous = false;

      const voiceTimeout = setTimeout(() => {
        recognition.abort();
        resolve("음성 인식 시간이 초과되었습니다.");
      }, 9000);

      recognition.onresult = (event) => {
        clearTimeout(voiceTimeout);
        let finalResult = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalResult += event.results[i][0].transcript;
          }
        }
        const optionsArray = currentGameData.options;
        setBestMatchResult(null);
        const bestMatch = stringSimilarity.findBestMatch(finalResult, optionsArray);
        setBestMatchResult(bestMatch);
        const bestOptionIndex = bestMatch.bestMatchIndex;
        const voiceMsg =
            bestOptionIndex === currentGameData.answer - 1
                ? `표현력이 좋아요! 정답은 ${optionsArray[bestOptionIndex]}이에요!`
                : `아쉬워요! 정답은 ${optionsArray[currentGameData.answer-1]}이에요!`;
        resolve(voiceMsg);
      };

      recognition.onerror = () => {
        clearTimeout(voiceTimeout);
        resolve("음성 인식 실패");
      };

      recognition.start();
    });

    try {
      const [faceMsg, voiceMsg] = await Promise.all([facePromise, voicePromise]);
      setFaceResult(faceMsg);
      setVoiceResult(voiceMsg);
      setPhase("analysisResult");
      // 작업 완료 후 recognitionRef 초기화
      recognitionRef.current = null;
    } catch (error) {
      console.error("[runConcurrentAnalysis] 동시 분석 오류:", error);
    }
  };

  // ---3. 얼굴 분석만 (표정 연습) ------------------
  const runFaceAnalysis = async () => {
    // 새 분석 시작 시 취소 플래그 초기화
    analysisCanceledRef.current = false;
    const faceMsg = await new Promise((resolve) => {
      analysisDataRef.current = [];
      const intervalId = setInterval(async () => {
        if (webcamRef.current && webcamRef.current.video) {
          const videoElement = webcamRef.current.video;
          const detections = await faceApi
              .detectAllFaces(videoElement, new faceApi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();
          if (detections.length > 0) {
            const emotions = detections.map((det) => det.expressions);
            analysisDataRef.current.push({
              timestamp: new Date().toISOString(),
              emotions,
            });
          }
        }
      }, 100);
      analysisIntervalRef.current = intervalId;
      setTimeout(() => {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
        const avgEmotion = computeAverageEmotion(analysisDataRef.current);
        if (!avgEmotion) {
          resolve("표정 분석 실패");
          return;
        }
        const candidates = ["happy", "sad", "angry", "fearful", "surprised"];
        const candidateAverages = candidates.map((emotion) => ({
          emotion,
          value: avgEmotion[emotion] || 0,
        }));
        candidateAverages.sort((a, b) => b.value - a.value);
        const bestEmotion = candidateAverages[0].emotion;
        const expectedEmotions = ["happy", "sad", "angry", "fearful", "surprised"];
        const expectedEmotion = expectedEmotions[currentVideoIndex] || "없음";
        const emotionMap = {
          happy: "행복",
          sad: "슬픔",
          angry: "화남",
          fearful: "공포",
          surprised: "놀람"
        };
        
        const displayExpectedEmotion = emotionMap[expectedEmotion] || expectedEmotion;
        
        const resultMsg =
          bestEmotion === expectedEmotion
            ? `표현력이 좋아요!`
            : `아쉬워요! 정답은 "${displayExpectedEmotion}" 이에요!`;
        resolve(resultMsg);
        
      }, 9000);
    });
    setFaceResult(faceMsg);
    setPhase("analysisResult");
  };

  // ---4. 음성 분석만 (말 연습) ------------------
  const runVoiceAnalysis = async () => {

    // 새 음성 분석 시작 시 취소 플래그를 false로 초기화
    analysisCanceledRef.current = false;

    const voiceMsg = await new Promise((resolve, reject) => {
      if (analysisCanceledRef.current) {
        resolve("분석 취소됨");
        return;
      }
      if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        console.error("[runVoiceAnalysis] 이 브라우저는 Speech Recognition을 지원하지 않습니다.");
        reject("이 브라우저는 Speech Recognition을 지원하지 않습니다.");
        return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      // 저장
      recognitionRef.current = recognition;

      recognition.lang = "ko-KR";
      recognition.interimResults = false;
      recognition.continuous = false;
      const voiceTimeout = setTimeout(() => {
        recognition.abort();
        resolve("음성 인식 시간이 초과되었습니다.");
      }, 9000);
      recognition.onresult = (event) => {
        clearTimeout(voiceTimeout);
        if (analysisCanceledRef.current) {
          resolve("분석 취소됨");
          return;
        }
        let finalResult = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalResult += event.results[i][0].transcript;
          }
        }
        const optionsArray = currentGameData.options;
        const bestMatch = stringSimilarity.findBestMatch(finalResult, optionsArray);
        const bestOptionIndex = bestMatch.bestMatchIndex;
        const resultMsg =
            bestOptionIndex === currentGameData.answer - 1
            ? `표현력이 좋아요!`
            : `아쉬워요! 정답은 ${optionsArray[currentGameData.answer-1]}이에요!`;
        resolve(resultMsg);
      };
      recognition.onerror = (event) => {
        clearTimeout(voiceTimeout);
        console.error("[runVoiceAnalysis] 음성 인식 오류:", event.error);
        resolve("음성 인식 실패");
      };
      recognition.start();
    });

    if (voiceMsg === "분석 취소됨") {
      return;
    }
    setVoiceResult(voiceMsg);
    setPhase("analysisResult");
    // 작업 완료 후 recognitionRef 초기화
    recognitionRef.current = null;
  };


  // --------------------------------------------------------- //
  // 시그널 수신 및 핸들링                                         //
  // --------------------------------------------------------- //
  const nextChapter = async () => {
    const storeState = useGameStore.getState();
    const currentStageIndex = storeState.currentStageIndex; // 0-based
    const currentChapter = storeState.currentChapter;
    const chapterData = storeState.chapterData;
    const stageCount = chapterData[currentChapter]?.length || 0;

    const nextStageIndex = currentStageIndex + 1;
    if (nextStageIndex >= stageCount) {
      SwAl.fire({
        title: `${currentChapter}단계 마지막이에요!`,
        imageUrl: "/child/character/againCh.png",
        imageWidth: 200,
        imageHeight: 200,
        confirmButtonText: "확인",
      });
      return;
    }
    resetAnalysisState();

    // setChapterAndStage는 1-based gameStageId를 받으므로, nextStageIndex + 1로 전달
    useGameStore.getState().setChapterAndStage(currentChapter, nextStageIndex + 1);

    const gameData = await useGameStore.getState().getCurrentGameData();
    setCurrentGameData(gameData);
    setPhase("video");
    setAnalysisCycle(1);
    setIsPlaying(false);
  };

  const previousChapter = async () => {
    const storeState = useGameStore.getState();
    const currentStageIndex = storeState.currentStageIndex; // 0-based
    const currentChapter = storeState.currentChapter;

    if (currentStageIndex <= 0) {
      SwAl.fire({
        title: `${currentChapter}단계 첫번째 단원입니다!`,
        imageUrl: "/child/character/againCh.png",
        imageWidth: 200,
        imageHeight: 200,
        confirmButtonText: "확인",
      });
      return;
    }
    const newStageIndex = currentStageIndex - 1;
    // setChapterAndStage는 1-based gameStageId를 받으므로, newStageIndex + 1로 전달
    resetAnalysisState();
    useGameStore.getState().setChapterAndStage(currentChapter, newStageIndex + 1);

    const gameData = await useGameStore.getState().getCurrentGameData();
    setCurrentGameData(gameData);
    setPhase("video");
    setAnalysisCycle(1);
    setIsPlaying(false);
  };

  const handleStartRecording = () => {
    setAnalysisReady(true);
    startRecording();
  };

  const handleStopRecording = () => {
    setAnalysisReady(false);
    stopRecording();
  };

  const resetAnalysisState = () => {
    // 현재 진행 중인 분석 작업들을 중단하기 위해 취소 플래그를 true로 설정합니다.
    analysisCanceledRef.current = true;

    // 진행 중인 얼굴 분석 인터벌 클리어
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    // SpeechRecognition 인스턴스 취소 (아래 recognitionRef를 사용)
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    // 분석 데이터 및 결과 초기화
    analysisDataRef.current = [];
    setFaceResult(null);
    setVoiceResult(null);
    setAnalysisCycle(1);
    setPhase("video");
    SwAl.close();
  };

  useEffect(() => {
    if (session) {
      const signalHandler = (event) => {

        // 전달받은 시그널 타입에 따라 분기하여 처리합니다.
        switch (event.data) {
          case "start-chapter":
            SwAl.close();
            SwAl.fire({
              title: "상담사 선생님이 수업을 시작했어요!",
              imageUrl: "/child/character/againCh.png",
              imageWidth: 200,
              imageHeight: 200,
              showConfirmButton: false,
              timer: 2000, // 2초 후 자동 닫힘
            }).then(async () => {
              setIsStart(true);
              await sendStartChapter();
            });
            break;
          case "previous-stage":
            previousChapter();
            break;
          case "record-start":
            handleStartRecording();
            break;
          case "record-stop":
            handleStopRecording();
            break;
          case "next-stage":
            nextChapter();
            break;
          case "end-chapter":
            if (session) {
              session.disconnect();
            }
            window.history.back();
            break;
          default:
        }
      };

      // 세션에서 시그널 이벤트 등록
      session.on("signal", signalHandler);

      // 컴포넌트 unmount 시 이벤트 핸들러 제거
      return () => {
        session.off("signal", signalHandler);
      };
    }
  }, [session, currentGameData, isRecording, previousChapter, handleStartRecording, stopRecording, nextChapter]);


  // --------------------------------------------------------- //
  // API 호출                                                   //
  // --------------------------------------------------------- //
  const sendGameData = async () => {
    if (!voiceResult || !currentGameData) return;
    const selectedOptionMatch = voiceResult.match(/정답은 (.+)이에요/);
    const selectedOption = selectedOptionMatch ? selectedOptionMatch[1] : "";
    const selectedOptionIndex = currentGameData.options.findIndex(
        (option) => option === selectedOption
    );
    if (selectedOptionIndex !== -1) {
      const optionNumber = selectedOptionIndex + 1;
      const isCorrect = optionNumber === currentGameData.answer;
      const emotionData = analysisDataRef.current;
      const avgEmotions = computeAverageEmotion(emotionData);
      const gameLearningDocument = {
        selectedOption: optionNumber,
        corrected: isCorrect,
        consulted: true,
        childGameStageId: Number(childGameStageId),
        childUserId: Number(childId),
        gameStageId: Number(currentGameData.gameStageId),
        fHappy: Number(avgEmotions?.happy || 0),
        fAnger: Number(avgEmotions?.angry || 0),
        fSad: Number(avgEmotions?.sad || 0),
        fPanic: Number(avgEmotions?.surprised || 0),
        fFear: Number(avgEmotions?.fearful || 0),
        tHappy: Number(avgEmotions?.happy || 0),
        tAnger: Number(avgEmotions?.angry || 0),
        tSad: Number(avgEmotions?.sad || 0),
        tPanic: Number(avgEmotions?.surprised || 0),
        tFear: Number(avgEmotions?.fearful || 0),
        stt: bestMatchResult.bestMatch.target,
        aiAnalysis: "test"
      };
      try {
        const response = await saveGameData(gameLearningDocument);
        setGameLogId(response.gameLogId);
      } catch (error) {
        console.error(`분석 사이클 ${analysisCycle} 게임 데이터 저장 실패:`, error);
      }
    }
  };

  const sendStartChapter = async ()=> {
    try{
      const chapterStartData = {
        childUserId: Number(childId),
        gameChapterId: Number(currentGameData?.chapterId),
      }
      const response = await startChapter(chapterStartData);
      setChildGameChapterId(response.childGameChapterId);

    } catch (error) {
      console.error("챕터 시작 데이터 전송 실패:", error);
    }
  }

  const sendStartStage = async () => {
    try{
      const stageStartData = {
        gameStageId: Number(currentGameData?.gameStageId),
        childGameChapterId: Number(childGameChapterId),
      }
      const response = await startStage(stageStartData);
      setChildGameStageId(response.childGameStageId);

    }catch(error){
      console.error(error)
    }
  }

  const sendEndChapter = async () => {
    try{
      const chapterEndData = {
        childGameChapterId: childGameChapterId,
      }
      await endChapter(chapterEndData);  // API 함수는 별도 파일에서 import

    } catch(error){
      console.error(error)
    }
  }
  const sendGameVideo = async (blob) => {
    try {
      const file = new File([blob], "recording.webm", { type: "video/webm" });
      const response = await uploadFile([file], [TBL_TYPES.GAME], [Number(gameLogId)]);
      return response;
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      throw error;
    }
  };
  const sendUpdateChildStage = async () => {
    try{
      const updateChildStageData = {
        childId: Number(childId),
        chapter: currentGameData?.chapterId,
        stage: Number(5),
      }
      const response = await updateChildStage(updateChildStageData);
      return response;
    } catch(error){
      console.error(error);
    }
  };

  // --------------------------------------------------------- //
  // 알람 기능                                                   //
  // --------------------------------------------------------- //
  const isOtherParticipantAbsent = () => {
    if (!session) {
      return false; // 세션이 없으면 아직 판단할 수 없음
    }

    let childStreamExists = false;

    if (session.streams && typeof session.streams.forEach === "function") {
      session.streams.forEach((stream) => {
        if (stream.typeOfVideo === "VIDEO") {
          childStreamExists = true;
        }
      });
    }

    return !childStreamExists;
  };
  useEffect(() => {
    const checkAbsence = async () => {
      if (isOtherParticipantAbsent()) {
        // 알람 전송에 필요한 데이터(alarmDto)를 구성합니다.
        const alarmDto = {
          toUserId: Number(childId),
          senderRole: "ROLE_PARENT",
          sessionType: "game",
        };

        try {
          await sendAlarm(alarmDto);
        } catch (error) {
          console.error("[checkAbsence] 알람 전송 실패:", error);
        }
      }
    };

    // 5초마다 체크 (원하는 시간 간격으로 변경 가능)
    checkAbsence();
  }, [session, childId]);

  return (
    <div className="ch-review-game-container">
      <div className="ch-review-container">
        {/* 왼쪽: 게임 동영상 영역 */}
        <div className="ch-review-game-left">
          <Card className="ch-game-screen-container">
            {currentGameData && (
              <>
                <h2>
                  {currentGameData.chapterId}단계{" "}
                  {currentGameData.gameStageId}단원
                </h2>
                <h3>{currentGameData.situation}</h3>
              </>
            )}
            <video
              ref={videoRef}
              src={currentGameData ? currentGameData.gameVideo : ""}
              className="ch-gameVideo"
              onEnded={() => {
                sendStartStage();
                handleVideoEnd();
              }}
            />
            
            {/* ProgressBar 유지 */}
            <ProgressBar
              className="ch-review-progressbar"
              value={(currentVideoIndex + 1) * 20}
              style={{
                width: "80%",
                height: "15px",
                margin: "0 auto",
                marginTop: "20px",
              }}
            />
  
            {/* 분석 메시지 화면 */}
            {phase === "analysis" && (
              <Card className="ch-learning-message-screen">
                <div className="learning-message">
                  <h3>분석 중입니다...</h3>
                </div>
              </Card>
            )}
  
            {/* 선택지 버튼 영역 - 원본 스타일 유지 */}
            <div className="ch-game-button">
              {currentGameData?.optionImages?.length > 0 &&
                currentGameData?.options?.length > 0 && (
                  <div className="option-images">
                    {currentGameData.optionImages.map((imgSrc, index) => (
                      <div key={index} className="option-item">
                        <h2 className="ch-options-number">
                          {["①", "②", "③"][index]}
                        </h2>
                        <img
                          src={imgSrc}
                          alt={`option ${index + 1}`}
                          className="option-image"
                        />
                        <p className={`ch-option-text ${
                          analysisCycle < 3
                            ? index + 1 === currentGameData?.answer
                              ? "ch-learning-before-answer"
                              : ""
                            : index + 1 === currentGameData?.answer
                              ? "ch-learning-correct-answer"
                              : ""
                        }`}>
                          {currentGameData.options[index]}
                        </p>
                      </div>
                    ))}
                  </div>
              )}
            </div>
          </Card>
        </div>
  
        {/* 오른쪽: 웹캠 및 상담가 화면 영역 */}
        <div className="ch-review-game-right">
          <div className="ch-game-face-screen">
            <Card className="ch-game-Top-section">
              <Webcam
                audio={true}
                ref={webcamRef}
                videoConstraints={{
                  width: 320,
                  height: 240,
                  facingMode: "user",
                }}
                style={{
                  backgroundColor: "#000",
                  width: "100%",
                  height: "20rem",
                  marginTop: "4px",
                  transform: "scaleX(-1)",
                  borderRadius: "1%",
                }}
              />
            </Card>
            <div className="ch-game-middle-section"></div>
            <div className="ch-game-bottom-section">
              <div className="ch-game-button-left">
                <img src="/child/button-left.png" alt="button-left" />
              </div>
              <Card className="ch-game-counselor-screen">
                <CounselorCamWithChild 
                  session={session} 
                  subscriber={subscriber} 
                  mode="subscribe"
                />
              </Card>
              <div className="ch-game-button-right">
                <img src="/child/button-right.png" alt="button-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildClassPage;