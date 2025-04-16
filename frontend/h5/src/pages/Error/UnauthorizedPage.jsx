import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "./UnauthorizedPage.css";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="unauthorized-container">
      <h1>접근 권한이 없습니다</h1>
      <p>죄송합니다. 이 페이지에 접근할 권한이 없습니다.</p>
      <Button label="홈으로 이동" onClick={handleGoHome} />
    </div>
  );
};

export default UnauthorizedPage;
