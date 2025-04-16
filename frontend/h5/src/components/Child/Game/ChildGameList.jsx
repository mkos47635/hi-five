import "../ChildCss/ChildGameList.css";
import { Card } from "primereact/card";
import useGameStore from "../../../store/gameStore";
import PropTypes from "prop-types";
import { useEffect } from "react";

function ChildGameList({ gameChapterId, chapterPic, title, isLocked, onClick }) {
  const { gameReviewData, selectChapter } = useGameStore();

  useEffect(() => {
    // console.log("게임챕터데이터:", gameReviewData);
  }, [gameReviewData]);

  const handleClick = () => {
    if (!isLocked && onClick) {
        selectChapter(gameChapterId);
        console.log(selectChapter)
      onClick();
    }
  };

  return (
    <div>
      <Card className="ch-game-chapter-card" onClick={handleClick}>
        <div className="ch-game-screenshot">
          {console.log("isLocked 상태:", isLocked)}
          <img
            src={chapterPic}
            alt="chapterimg"
            className={isLocked ? "isLocked-img" : ""}
          />
          <h1 className="ch-game-chapter-title">
            {title}
            {isLocked && <span className="lock-icon">🔒</span>}
          </h1>
        </div>
      </Card>
    </div>
  );
}

// PropTypes 정의
ChildGameList.propTypes = {
  gameChapterId: PropTypes.number.isRequired,
  chapterPic: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
};
export default ChildGameList;
