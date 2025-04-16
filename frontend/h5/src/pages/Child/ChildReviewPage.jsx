import "./ChildCss/ChildReviewPage.css";
import ChildGameList from "../../components/Child/Game/ChildGameList";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { chapter } from "../../api/childGame";
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper 스타일들 import
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

// Swiper 모듈들 import
import { EffectCube, Pagination } from 'swiper/modules';

function ChildReviewPage() {
  const navigate = useNavigate();
  const childId = sessionStorage.getItem("childId");
  const [chapterData, setChapterData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await chapter();
      const chapterlist = response.chapterAssetDtoList;

      const limit = response.limit
      console.log("제한!!",limit)

      const chapterdummyData = [
        {
          gameChapterId: 3,
          chapterPic: "/child/chapterdummyimg.jpg",
          title: "개발 중",
          isLocked: true,
        },
        {
          gameChapterId: 4,
          chapterPic: "/child/chapterdummyimg.jpg",
          title: "개발 중",
          isLocked: true,
        },
        {
          gameChapterId: 5,
          chapterPic: "/child/chapterdummyimg.jpg",
          title: "개발 중",
          isLocked: true,
        },
      ];

      const possibleChapter = chapterlist.map((item)=>{
        if(item.gameChapterId > 2){
          return{
            ...item,
            isLocked: true,
          }
        }
        return {
          ...item,
          isLocked:false,
        }
      }) 
      console.log("가능한챕터!!", possibleChapter)

      setChapterData([...possibleChapter, ...chapterdummyData]);
    };
    fetchData();
  }, []);

  const handleChapterClick = (item) => {
    if (item.isLocked) {
      alert("아직 개발 중인 챕터입니다!");
      return;
    }
    navigate(`/child/${childId}/review/${item.gameChapterId}`, {
      state: { chapterId: item.gameChapterId },
    });
  };

  return (
    <div className="ch-child-game-list-container">
      <h3 className="ch-chpater-list-title"> 부드럽게 상자를 밀어볼까요?</h3>
      {chapterData && (
        <div style={{ width: '200%', maxWidth: '800px', height: '700px' }}>
          <Swiper
            effect={'cube'}
            grabCursor={true}
            cubeEffect={{
              shadow: true,
              slideShadows: true,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            pagination={true}
            modules={[EffectCube, Pagination]}
            className="mySwiper"
            style={{
              width: "55rem",
              height:"35rem",
            }}
          >
            {chapterData.map((item) => (
              <SwiperSlide key={item.gameChapterId}>
                <ChildGameList
                  gameChapterId={item.gameChapterId}
                  chapterPic={item.chapterPic}
                  title={item.title}
                  isLocked={item.isLocked}
                  onClick={() => handleChapterClick(item)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

export default ChildReviewPage;