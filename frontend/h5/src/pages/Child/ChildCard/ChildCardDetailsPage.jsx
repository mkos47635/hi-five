import { useMemo } from "react";
import CardDetailsLayout from "../../../components/Child/Card/CardDetailsLayout";
import { useLocation } from "react-router-dom";

function ChildCardDetailsPage() {
  // 현재 페이지의 위치 가져오기
  const location = useLocation();
  const emotion = location.state?.emotion;
  const filteredCards = location.state?.filteredCards || []; // ✅ 필터링된 카드 리스트

  // ✅ 콘솔 로그로 데이터 확인
  console.log("📌 전달받은 감정 데이터:", emotion);
  console.log("📌 전달받은 필터링된 카드 리스트:", filteredCards);
  console.log("📌 emotionType 전달 확인:", emotion?.type);


  // 감정 타입별 설명
  const emotionContent = useMemo(() => {
    if (!emotion || !emotion.type) {
      return <div>🚨 감정 정보를 찾을 수 없습니다.</div>;
    }

    switch (emotion.type) {
      case "joy":
        return <div className="ch-joy-detail-content">😊 기쁨을 표현하는 방법과 관련된 카드들</div>;
      case "sadness":
        return <div className="ch-sadness-detail-content">😢 슬픔을 다루는 방법과 관련된 카드들</div>;
      case "anger":
        return <div className="ch-anger-detail-content">😡 화가 났을 때 조절하는 방법과 관련된 카드들</div>;
      case "fear":
        return <div className="ch-fear-detail-content">😨 두려움을 극복하는 방법과 관련된 카드들</div>;
      case "surprise":
        return <div className="ch-surprise-detail-content">😲 놀라움을 표현하는 방법과 관련된 카드들</div>;
      default:
        return <div>🚨 감정 정보를 찾을 수 없습니다.</div>;
    }
  }, [emotion]);

  // ✅ 데이터가 없을 경우 예외 처리
  if (!emotion) {
    return <div>🚨 감정 정보를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
      <div>
        {/* 감정 카드 상세 레이아웃 */}
        <CardDetailsLayout emotion={emotion} filteredCards={filteredCards} emotionType={emotion.type} />
        {emotionContent}

        {/* ✅ 필터링된 카드 리스트 렌더링 */}
        <div className="ch-card-list">
          {filteredCards.length > 0 ? (
              <ul>
                {filteredCards.map((card) => (
                    <li key={card.stageId} className="ch-card-item">
                      <img src={card.cardFront} alt="카드 앞면" className="ch-card-image" />
                      <img src={card.cardBack} alt="카드 뒷면" className="ch-card-image" />
                    </li>
                ))}
              </ul>
          ) : (
              <p>⚠ 해당 감정의 카드가 없습니다.</p>
          )}
        </div>
      </div>
  );
}

export default ChildCardDetailsPage;
