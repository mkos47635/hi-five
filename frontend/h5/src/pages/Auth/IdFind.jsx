import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '/logo.png';
import './IdFind.css';

function IdFind() {
  const navigate = useNavigate();
  const { email, name } = useParams();

  return (
    <>
        <div className="p_logo-container">
            <img src={logo} alt="Logo" className="find_logo" />
        </div>
        <div className="Pfind-container">
        <Card className="p_card-container2">
            <h1><strong>{email ? `${name}님의 아이디는 ${email}입니다.` : "아이디를 찾을 수 없습니다."}</strong></h1>
            <div className="p_button-container">
            <Button label="확인" className="p-ok-button" onClick={() => navigate('/')} />
            </div>
        </Card>
        </div>
    </>
  );
}

export default IdFind;
