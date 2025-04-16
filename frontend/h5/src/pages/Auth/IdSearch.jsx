import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findParentEmail, findConsultantEmail } from "/src/api/authService";
import logo from '/logo.png';
import './IdSearch.css';

const memberTypes = [
  { label: '학부모', value: 'parent' },
  { label: '상담사', value: 'consultant' },
];

function IdSearch() {
  const [selectedType, setSelectedType] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const navigate = useNavigate();

  const handleFindId = async () => {
    if (!selectedType || !name || !phone) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    
    if (phone.includes("-")) {
      setPhoneError("*하이픈(-) 없이 작성해주세요.");
      return;
    } else {
      setPhoneError(null);
    }

    try {
      let response;
      if (selectedType === "parent") {
        response = await findParentEmail(name, phone);
      } else {
        response = await findConsultantEmail(name, phone);
      }
      
      if (response) {
        navigate(`/login/idfind/${name}/${response}`);
      } else {
        setError("입력된 정보로 아이디를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("아이디 찾기 실패", error);
      setError("입력된 정보로 아이디를 찾을 수 없습니다.");
    }
  };

  return (
    <>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="auth_logo" />
      </div>
      <div className="app-container">
        <Card className="Id_card-container">
          <h1><strong>아이디 찾기</strong></h1>
          <div className="input-container">
            <p>회원유형</p>
            <Dropdown className="input-field" value={selectedType} options={memberTypes} onChange={(e) => setSelectedType(e.value)} placeholder="회원유형을 선택해주세요" />
          </div>
          <div className="input-container">
            <p>이름</p>
            <InputText className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력해주세요." />
          </div>
          <div className="input-container">
            <p>핸드폰번호</p>
            <InputText className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="핸드폰 번호를 입력해주세요." />
            <div className='small-container'>
              {phoneError ? (
                <small className="error-message">{phoneError}</small>
              ) : error ? (
                <small className="error-message">{error}</small>
              ) : (
                <small>*하이픈(-) 없이 작성해주세요.</small>
              )}
            </div>
          </div>
          <div className="button-container">
            <Button label="취소" className="cancel-button" onClick={() => navigate('/')} />
            <Button label="아이디 찾기" className="find-button" onClick={handleFindId} />
          </div>
        </Card>
      </div>
    </>
  );
}

export default IdSearch;
