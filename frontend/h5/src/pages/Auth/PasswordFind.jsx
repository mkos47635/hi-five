import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png'
import './PasswordFind.css';


function PasswordFind() {
  const navigate = useNavigate();
  return (
    <>
        <div className="I_logo-container">
            <img src={logo} alt="Logo" className="find_logo" />
        </div>
        <div className="IdFind-container">
        <Card className="I_card-container">
            <h1><strong>임시 비밀번호가 이메일로 전송되었습니다.</strong></h1>
            <div className="I_button-container">
            <Button label="확인" className="ok-button" onClick={() => navigate('/')}/>
            </div>
        </Card>
        </div>
    </>
  );
}

export default PasswordFind;