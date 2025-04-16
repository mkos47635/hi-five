import "../ChildCss/CardDetailsLayout.css";
import PropTypes from "prop-types";
import { useState, useRef, useMemo } from "react";

function CardDetailsLayout({ emotion, filteredCards, emotionType }) {
    const maxCards = 6;
    // useMemo를 사용해 displayedCards를 한 번만 계산합니다.
    const displayedCards = useMemo(() => {
        const cards = [...filteredCards];
        while (cards.length < maxCards) {
            if (emotionType === "joy") {
                cards.push({ stageId: null, cardFront: "/child/card/Joymi_ChallengeCard.png", cardBack: "/child/card/Joymi_ChallengeCard.png" });
            } else if (emotionType === "sadness") {
                cards.push({ stageId: null, cardFront: "/child/card/Sadmi_ChallengeCard.png", cardBack: "/child/card/Sadmi_ChallengeCard.png" });
            } else if (emotionType === "anger") {
                cards.push({ stageId: null, cardFront: "/child/card/Angrymi_ChallengeCard.png", cardBack: "/child/card/Angrymi_ChallengeCard.png" });
            } else if (emotionType === "fear") {
                cards.push({ stageId: null, cardFront: "/child/card/Scarymi_ChallengeCard.png", cardBack: "/child/card/Scarymi_ChallengeCard.png" });
            } else if (emotionType === "surprise") {
                cards.push({ stageId: null, cardFront: "/child/card/Surprisemi_ChallengeCard.png", cardBack: "/child/card/Surprisemi_ChallengeCard.png" });
            } else {
                cards.push({ stageId: null, cardFront: "/test/happy_front.png", cardBack: "/test/happy_back.png" });
            }
        }
        return cards;
    }, [filteredCards, emotionType, maxCards]);

    const scrollContainerRef = useRef(null);
    const [flippedCards, setFlippedCards] = useState(new Array(maxCards).fill(false));

    // 마우스 휠 이벤트 핸들러
    const handleWheel = (event) => {
        if (scrollContainerRef.current) {
            event.preventDefault();
            scrollContainerRef.current.scrollLeft += event.deltaY;
        }
    };

    const handleMouseEnter = (index) => {
        setFlippedCards((prev) => {
            const newFlippedCards = [...prev];
            newFlippedCards[index] = true;
            return newFlippedCards;
        });
    };

    const handleMouseLeave = (index) => {
        setFlippedCards((prev) => {
            const newFlippedCards = [...prev];
            newFlippedCards[index] = false;
            return newFlippedCards;
        });
    };

    return (
        <div className="ch-card-details-layout-container" style={{ backgroundColor: emotion.bgColor }}>
            <h1 className="ch-card-details-title">🩵 내가 모은 {emotion.name} 카드 🩵</h1>
            <div className="ch-card-details-content">
                <div className="ch-big-main-character">
                    <img src={emotion.image} alt={emotion.name} />
                </div>
                <div 
                    className="ch-card-deatils-list"
                    ref={scrollContainerRef}
                    onWheel={handleWheel}
                >
                    {displayedCards.slice(0, maxCards).map((card, index) => (
                        <div
                            key={index}
                            className={`ch-card ${flippedCards[index] ? "flipped" : ""}`}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                        >
                            <img src={card.cardFront} alt="카드 앞면" className="ch-card-front" />
                            <img src={card.cardBack} alt="카드 뒷면" className="ch-card-back" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

CardDetailsLayout.propTypes = {
    emotion: PropTypes.shape({
        name: PropTypes.string.isRequired,
        bgColor: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
    }).isRequired,
    filteredCards: PropTypes.arrayOf(
        PropTypes.shape({
            stageId: PropTypes.number,
            cardFront: PropTypes.string.isRequired,
            cardBack: PropTypes.string.isRequired,
        })
    ).isRequired,
    emotionType: PropTypes.string.isRequired,
};

export default CardDetailsLayout;
