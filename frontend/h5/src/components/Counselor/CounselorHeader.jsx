import '../Counselor/Css/CounselorHeader.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from "/src/api/authService"; // ✅ 로그아웃 API 불러오기
import { useState } from "react";

function CounselorHeader() {
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 `useNavigate`
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ✅ 로딩 상태 관리

  // ✅ 로그아웃 실행 함수
  const handleLogout = async (event) => {
    event.preventDefault(); // ✅ 기본 이동 방지
    if (isLoggingOut) return; // ✅ 이미 로그아웃 중이면 중복 실행 방지
    setIsLoggingOut(true);

    try {
      await logout(); // ✅ 로그아웃 API 호출
      navigate("/"); // ✅ 로그아웃 후 홈으로 이동
    } catch (err) {
      alert("로그아웃 실패! 다시 시도해주세요.");
      console.error("❌ 로그아웃 실패:", err.response ? err.response.data : err.message);
    } finally {
      setIsLoggingOut(false); // ✅ 로그아웃 완료 후 다시 버튼 활성화
    }
  };

  return (
    <nav className="co_navbar">
      <div>
        <Link to="/counselor">
          <img src="/logo.png" alt="로고" className="co_logo" />
        </Link>
      </div>
      <ul className="co_nav-list">
        <li className="co_nav-item">
          <NavLink to="/counselor/children">우리아이들</NavLink>
        </li>
        <li className="co_nav-item">
          <NavLink to="/counselor/schedule">상담일정</NavLink>
        </li>
        <li className="co_nav-item">
          <NavLink to="/counselor/board">게시판</NavLink>
        </li>
        <li className="co_nav-item">
          <NavLink to="/counselor/mypage">마이페이지</NavLink>
        </li>
        {/* ✅ 로그아웃 버튼 클릭 시 handleLogout 실행 */}
        <li className="co_nav-item">
          <Link to="/" onClick={handleLogout} className="co-logout-btn" disabled={isLoggingOut}>
            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default CounselorHeader;
