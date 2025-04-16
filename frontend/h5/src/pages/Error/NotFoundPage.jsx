import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="notfound-container">
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>죄송합니다. 요청하신 페이지가 존재하지 않습니다.</p>
      <Button label="홈으로 이동" onClick={handleGoHome} />
    </div>
  );
};

export default NotFoundPage;
