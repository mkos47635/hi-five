import { useNavigate, useParams } from "react-router-dom";
import "./ChildCss/ChildMainPage.css";
import { Card } from "primereact/card";
import ChildMainBackground from "../../components/Child/ChildMainBackground";
import useChildIdstore from "../../store/childIdStore";
// import useGameStore from "../../store/gameStore";
// import { limitGamedata } from "../../api/childGameContent";

//✅ api 호출과 변수 관리에 필요한 import ✅
import { getParentChildren } from "/src/api/userParent";
import { useState, useEffect } from "react";
//❌ api 호출과 변수 관리에 필요한한 import ❌

function ChildMainPage() {
  console.log("ChildReviewGamePage rendered");
  const navigate = useNavigate();
  const { childId } = useParams();

  //✅ zustand 스토어의 setChildId,setChildName 가져오기 ✅
  const { setChildName, setChildId } = useChildIdstore();

  //✅ api 호출, 호출된 data 중 childId와 일치하는 아이 이름 꺼내오기 ✅
  const [ingredientsList, setIngredientsList] = useState([]);

  useEffect(() => {
    // console.log("현재저장된 아동아이디:", sessionStorage.childId);
    async function getChildName() {
      try {
        const childrenData = await getParentChildren();
        setIngredientsList(childrenData);
        const matchedChild = childrenData.find(
          (child) => String(child.childUserId) === String(childId)
        );
        if (matchedChild) {
          // Zustand 스토어에 childId와 childName 저장
          setChildId(childId);
          setChildName(matchedChild.childUserName);

          console.log("✅ 선택된 아동 이름:", matchedChild.childUserName);
        } else {
          console.log("⚠️ 일치하는 아동을 찾을 수 없습니다.");
          // navigate("/error");
        }
      } catch (error) {
        console.error("❌ 아이 목록 불러오기 실패:", error);
        // navigate("/error");
      }
    }
    getChildName();
  }, [childId, setChildId, setChildName, navigate]);
  //❌ api 호출, 호출된 data 중 childId와 일치하는 아이 이름 꺼내오기기 ❌

  // Zustand 스토어에서 childName 가져오기
  const { childName } = useChildIdstore();

  // 스테이지, 챕터 limitGameData API 호출
  // const handleLimitClick = async () => {
  //   try {
  //     console.log("1. 학습 제한 데이터 불러오는 중...");
  //     const data = await limitGamedata(childId);
  //     if (data) {
  //       console.log("2. 학습 제한 데이터:", data);
  //       await useGameStore.getState().fetchChapterData(data.chapter);
  //       navigate(`/child/${childId}/todayclass`, {
  //         state: {
  //           stageId: data.stage,
  //           chapterId: data.chapter,
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("데이터 로드 실패:", error);
  //   }
  // };

  return (
    <div className="ch-main-container">
      {/* <ChildMainBackground /> */}
      {/* <Outlet/> */}
      <ChildMainBackground />
      <div className="ch-main-foreground">
        <Card className="ch-login-state">
          안녕! <p className="ch-childName"> {childName || "아동 없음"}</p>{" "}
          감정아 오늘은 어떤 감정을 만나볼까?
        </Card>

        <div className="ch-menu-container">
          {/* <Card className="ch-class" onClick={handleLimitClick}> */}
          <Card className="ch-class" onClick={()=>navigate(`/child/${childId}/todayclass`)}>
            <div className="ch-class-wrapper">
              <div className="ch-today-class-img">
                <img src="/child/main/today-class-img.png" alt="todayImg" />
              </div>
              <div className="ch-today-class-content">
                <h1>오늘의 수업</h1>
                <p>선생님과 함께하는 감정게임!</p>
              </div>
            </div>
          </Card>

          <Card
            className="ch-review"
            onClick={() => navigate(`/child/${childId}/review`)}
          >
            <div className="ch-review-wrapper">
              <div className="ch-review-img">
                <img src="/child/main/review-img.png" alt="" />
              </div>
              <div className="ch-review-content">
                <h1>감정놀이 복습</h1>
                <p>혼자서 다시해봐요~!</p>
              </div>
            </div>
          </Card>
          <Card
            className="ch-cardmain"
            onClick={() => navigate(`/child/${childId}/cardmain`)}
          >
            <div className="ch-cardmain-wrapper">
              <div className="ch-cardmain-page-img">
                <img src="/child/main/card-list-img.png" alt="" />
              </div>
              <div className="ch-cardmain-page-content">
                <h1>카드상자</h1>
                <p>내가 모은 카드, 한번 볼까요?</p>
              </div>
            </div>
          </Card>
          <Card
            className="ch-chatbot"
            onClick={() => navigate(`/child/${childId}/chatbot`)}
          >
            <div className="ch-chatbot-wrapper">
              <div className="ch-chatbot-page-img">
                <img src="/child/main/chat-img.png" alt="" />
              </div>
              <div className="ch-chatbot-page-content">
                <h1>마음이 챗봇</h1>
                <p>마음이랑 이야기해요~!</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ChildMainPage;
