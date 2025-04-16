import "./App.css";
import "@fontsource/noto-sans-kr";
import "@fontsource/jua";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import ChildMainPage from "./pages/Child/ChildMainPage";
import ParentMainPage from "./pages/Parent/ParentMainPage";
import CounselorMainPage from "./pages/Counselor/CounselorMainPage";
import ChildLayout from "./components/Child/ChildLayout";
import AppChild from "./routes/AppChild";
import AppParent from "./routes/AppParent";
import AppCounselor from "./routes/AppCounselor";
import AuthRoutes from "./routes/AuthRoutes";
import ProtectedRoute from "/src/routes/ProtectedRoute";
import {useEffect, useRef} from "react";
import { useUserStore } from "./store/userStore.js";
import { getUserInfo } from "/src/api/authService.jsx";
import UnauthorizedPage from "/src/pages/Error/UnauthorizedPage";
import NotFoundPage from "/src/pages/Error/NotFoundPage";
import {connectStomp, disconnectStomp} from "./socket.js";
import {Toast} from "primereact/toast";

function App() {
  const { setUserName, setUserRole } = useUserStore();
  const toast = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("access_token");
        if (accessToken) {
          const response = await getUserInfo();
          const { name, role } = response;
          setUserName(name);
          setUserRole(role);

          disconnectStomp();
          connectStomp((messageBody) => {
            // messageBody가 JSON 형식이라면 파싱
            const alarmDto = JSON.parse(messageBody);
            // alarmDto.message, alarmDto.time 등의 필드가 있다고 가정
            toast.current.show({
              severity: 'info',
              summary: '알림',
              detail: alarmDto.message,
              // life: 5000, // 5초 후 자동 닫힘
            });
          });
        }
      } catch (error) {
        console.error("유저 정보 조회 실패: ", error);
      }
    };

    fetchData();
  }, [setUserName, setUserRole]);

  return (
      <>
        <Toast ref={toast} position="bottom-right"/>
        <Router>
          <Routes>
            {/* 루트와 로그인 관련 경로는 로그인 페이지 또는 HomeRedirect 컴포넌트로 처리할 수 있음 */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login/*" element={<AuthRoutes />} />

            {/* 아동 페이지 (권한 검사는 보통 학부모 계정에서 진행) */}
            <Route path="/child" element={<ChildLayout />}>
              <Route index element={<ChildMainPage />} />
              <Route path="/child/*" element={<AppChild />} />
            </Route>

            {/* 학부모 전용 페이지: ProtectedRoute로 감쌈 */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_PARENT']} />}>
              <Route path="/parent" element={<ParentMainPage />} />
              <Route path="/parent/*" element={<AppParent />} />
            </Route>

            {/* 상담사 전용 페이지: ProtectedRoute로 감쌈 */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_CONSULTANT']} />}>
              <Route path="/counselor" element={<CounselorMainPage />} />
              <Route path="/counselor/*" element={<AppCounselor />} />
            </Route>

            {/* 권한이 없는 경우 표시할 페이지 */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* 존재하지 않는 경로로 접근한 경우 (404 Not Found) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </>
  );
}

export default App;
