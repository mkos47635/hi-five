import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './LoginPage.css';
import { login } from "/src/api/authService";
import { useUserStore } from "/src/store/userStore";
import {connectStomp} from "../../socket.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whoRU, setWhoRU] = useState('parent');
  const [error, setError] = useState(null);
  const [saveId, setSaveId] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveId(true); // 체크박스도 체크된 상태로 유지
    }
  }, []);

  const handleUserTypeChange = (role) => {
    setWhoRU(role);
  };

  const handleLogin = async () => {
    try {
      const role = whoRU === 'parent' ? 'ROLE_PARENT' : 'ROLE_CONSULTANT';
      console.log("📢 로그인 시도:", { email, password, role });

      const data = await login(email, password, role);
      console.log("🎉 로그인 성공!", data);
      console.log(data.name);
      useUserStore.getState().setUserName(data.name);
      useUserStore.getState().setUserRole(role);


      if (saveId) {
        localStorage.setItem("savedEmail", email); // 아이디 저장
      } else {
        localStorage.removeItem("savedEmail"); // 체크 해제 시 아이디 삭제
      }

      if(whoRU === 'parent' && data.pwdChanged===true){
        navigate("/login/passwordchange");
        connectStomp();
      }
      else{
        navigate(whoRU === 'parent' ? '/parent' : '/counselor');
        connectStomp();
      }
    } catch (err) {
      console.error("❌ 로그인 실패:", err.response ? err.response.data : err.message);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleSaveIdChange = (event) => {
    setSaveId(event.target.checked);
  };

  return (
    <div className="login-wrapper">
      <div className="clouds">
        <img src="/cloud1-remove.png" alt="cloud1" className="cloud cloud1" />
        <img src="/cloud2-remove.png" alt="cloud2" className="cloud cloud2" />
        <img src="/cloud3-remove.png" alt="cloud3" className="cloud cloud3" />
        <img src="/cloud3-remove.png" alt="cloud1" className="cloud cloud4" />
        <img src="/cloud2-remove.png" alt="cloud2" className="cloud cloud5" />
        <img src="/cloud1-remove.png" alt="cloud3" className="cloud cloud6" />
      </div>
      <div className="login-container">
        <div className="characters-container">
          <img src="test\againCh.png" alt="Blue character" className="character" style={{ transform: 'translateY(35px)' }}/>
          <img src="test\againCh.png" alt="Yellow character" className="character" style={{ transform: 'translateY(35px)' }}/>
          <img src="test\againCh.png" alt="Gray character" className="character" style={{ transform: 'translateY(35px)' }}/>
        </div>

        <div className="login-box">
          <img src="/logo.png" alt="Logo" className="l-logo" />
          <h2 className="subtitle">감정을 배우는 즐거운 여행</h2>
          
          <div className="tabs">
            <button 
              className={`tab ${whoRU === 'parent' ? 'active' : ''}`} 
              onClick={() => handleUserTypeChange('parent')}
            >
              학부모
            </button>
            <button 
              className={`tab ${whoRU === 'counselor' ? 'active' : ''}`}  
              onClick={() => handleUserTypeChange('counselor')}
            >
              상담사
            </button>
          </div>

          <div className="login-form">
            <span className="p-input-icon-left">
              <i className="pi pi-user" />
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="아이디를 입력해주세요"
                className="login-input"
                onKeyDown={handleKeyPress}
              />
            </span>

            <span className="p-input-icon-left">
              <i className="pi pi-lock" />
              <InputText
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요"
                className="login-input"
                onKeyDown={handleKeyPress}
              />
            </span>

            <div className="save-id">
              <input 
                type="checkbox" 
                className="save-id-checkbox" 
                checked={saveId}
                onChange={handleSaveIdChange}
              />
              <span>아이디 저장하기</span>
            </div>

            {error && <p className="error-message">{error}</p>} {/* 에러 메시지 표시 */}

            <Button label="로그인" className="login-button" onClick={handleLogin} />
            
            <div className="register-link">
              <span>
                <Link to="/login/idsearch">아이디</Link> | <Link to="/login/passwordsearch">비밀번호 찾기</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
