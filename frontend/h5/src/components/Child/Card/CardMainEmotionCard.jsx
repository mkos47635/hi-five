import "../ChildCss/CardMainEmotionCard.css";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useState } from "react";

function CardMainEmotionCard({ id, image, name, bgColor, textColor, onClick }) {
  const [isSelected, setIsSelected] = useState(false);

  // 더보기 클릭시 부모에게 클릭이벤트 전달 및 크기 확장
  const handleClick = () => {
    setIsSelected(true);
    // 애니메이션 완료 후 페이지 전환
    setTimeout(() => {
      // onClick() 실제로 페이지를 전환시키는 역할
      onClick(id);
    }, 500);
  };

  return (
    // 호버효과
    <motion.div
      className="ch-big-card-container"
      whileHover={isSelected ? {} : { y: -50, transition: { duration: 0.3 } }}
    >
      {/* 클릭시 카드 크기 증가 */}
      <div className="ch-big-card" onClick={handleClick}>
        <img src={image} alt={name} />
        <motion.div
          className="ch-big-name-card"
          style={{ backgroundColor: bgColor }}
          animate={
            isSelected
              ? {
                  position: "fixed",
                  scale: [1, 1.5, 3, 5],
                  top: "0px",
                  left: "0px",
                  zIndex: 1000,
                  borderRadius: ["100%", "20px", "0px"],
                }
              : {}
          }
          transition={{ duration: 1, ease: "easeInOut", times: [0, 0.2, 1] }}
        >
          <motion.h2
            className="ch-big-card-name"
            style={{ color: textColor }}
            animate={isSelected ? { opacity: 0 } : {}}
          >
            {name}
          </motion.h2>
        </motion.div>
        <div className="card-hover-text"> 카드 더보기 &gt; </div>
      </div>
    </motion.div>
  );
}

// 타입 검증 경고메세지가 떠서 작성
CardMainEmotionCard.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CardMainEmotionCard;
