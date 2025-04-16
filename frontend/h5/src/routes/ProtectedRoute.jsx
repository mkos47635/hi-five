import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "/src/store/userStore";
import PropTypes from "prop-types";

const ProtectedRoute = ({ allowedRoles }) => {
  // useUserStore 구독을 통해 role이 변경될 때마다 컴포넌트가 다시 렌더링됩니다.
  const role = useUserStore((state) => state.role);

  // role 값이 아직 설정되지 않았다면 로딩 상태를 표시합니다.
  if (role === "") {
    return <div>Loading...</div>;
  }

  // 사용자의 역할이 허용된 역할 목록에 포함되지 않으면 /unauthorized 페이지로 이동
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
