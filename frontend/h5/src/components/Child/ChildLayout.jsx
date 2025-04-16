import "./ChildCss/ChildLayout.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  // 현재 경로 확인용
  const location = useLocation();

  // 세션스토리지에서 childId 가져오기
  const childId = sessionStorage.getItem("childId");
  // 뒤로가기 경로 막을 곳
  const preventBackPaths = [`/child/${childId}`, "/child/todayclass"];


  const handleBack = () => {


    if (preventBackPaths.includes(location.pathname)) {
      return;
    }
  
    // 경로에서 chapterId 추출 (예: /child/2/review/1)
    const pathParts = location.pathname.split('/'); 
    const chapterId = pathParts[pathParts.length - 1];
    console.log("현재 경로:", location.pathname);
    if (preventBackPaths.includes(location.pathname)) {
      return;
    }
    // 복습 리스트 하위 게임 페이지
    else if (location.pathname.startsWith(`/child/${childId}/review/${chapterId}`)) {
      // 리뷰 게임에서는 리뷰 페이지로
      navigate(`/child/${childId}/review`);
    }
    // 카드 리스트 하위 게임 페이지
    else if (
      location.pathname.startsWith(`/child/${childId}/cardmain/details`)
    ) {
      // 리뷰 게임에서는 리뷰 페이지로
      navigate(`/child/${childId}/cardmain`);
    } else {
      navigate(`/child/${childId}`);
    }
  };
  // 챗봇페이지 // 카드 리스트 페이지 // 학습 게임 페이지 // 복습 리스트 페이지

  return (
    <>
      <div className="ch-header">
        <img src="/logo.png" alt="로고" className="ch-logo" />
        <h4
          className={`ch-header-back ${
            preventBackPaths.includes(location.pathname) ? "disabled" : ""
          }`}
          onClick={handleBack}
        >
          뒤로가기
        </h4>
      </div>
      <Outlet />
    </>
  );
}

export default Header;
