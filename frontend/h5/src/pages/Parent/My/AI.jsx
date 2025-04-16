import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

function AI() {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("");

  useEffect(() => {
    // 모델 로드
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      startVideo();
    };

    // 웹캠 활성화
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("웹캠 접근 실패:", err));
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    // 표정 분석
    const analyzeExpressions = async () => {
      const video = videoRef.current;
      if (!video) return;

      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const exp = detections.expressions;
        const maxExpression = Object.keys(exp).reduce((a, b) =>
          exp[a] > exp[b] ? a : b
        );

        // 표정 매핑
        const expressionMapping = {
          happy: "기쁜 표정",
          sad: "슬픈 표정",
          angry: "화남 표정",
          fearful: "무서운 표정",
          surprised: "당황한 표정",
          neutral: "중립적인 표정",
          disgusted: "불쾌한 표정",
        };

        setExpression(expressionMapping[maxExpression] || "인식 중...");
      }
    };

    const interval = setInterval(analyzeExpressions, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>AI 표정 인식</h1>
      <video ref={videoRef} autoPlay muted width="640" height="480" />
      <h2>현재 표정: {expression}</h2>
    </div>
  );
}

export default AI;
