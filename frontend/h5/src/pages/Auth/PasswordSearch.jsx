import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestParentTempPassword, requestConsultantTempPassword } from "/src/api/authService";
import logo from '/logo.png';
import './PasswordSearch.css';

const memberTypes = [
  { label: '학부모', value: 'parent' },
  { label: '상담사', value: 'consultant' },
];

function PasswordSearch() {
  const [selectedType, setSelectedType] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFindPwd = async () => {
    if (!selectedType || !name || !email) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    try {
      let response;
      if (selectedType === "parent") {
        response = await requestParentTempPassword(name, email);
      } else {
        response = await requestConsultantTempPassword(name, email);
      }
      
      if (response) {
        navigate("/login/passwordfind");
      } else {
        setError("입력된 정보로 비밀번호를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("비밀번호 찾기 실패", error);
      setError("입력된 정보로 비밀번호를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="app-container">
      <div className="logo-container2">
        <img src={logo} alt="Logo" className="auth_2_logo" />
      </div>
      <Card className="p_card-container3">
        <h1><strong>비밀번호 찾기</strong></h1>
        <div className="input-container">
          <p>회원유형</p>
          <Dropdown className="input-field" value={selectedType} options={memberTypes} onChange={(e) => setSelectedType(e.value)} placeholder="회원유형을 선택해주세요" />
        </div>
        <div className="input-container">
          <p>이름</p>
          <InputText className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요." />
        </div>
        <div className="input-container">
         <p>이메일</p>
         <InputText className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력해주세요." />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="p_button-container">
          <Button label="취소" className="cancel-button" onClick={() => navigate('/')}/>
          <Button label="비밀번호 찾기" className="find-button" onClick={handleFindPwd}/>
        </div>
      </Card>
    </div>
  );
}

export default PasswordSearch;
