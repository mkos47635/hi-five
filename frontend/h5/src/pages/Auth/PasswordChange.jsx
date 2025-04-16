import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png';
import SingleButtonAlert from '../../components/common/SingleButtonAlert';
import { changeParentPassword } from '/src/api/userParent';
import './PasswordChange.css';

function PasswordChange() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    // ✅ 비밀번호 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      await SingleButtonAlert('모든 필드를 입력해주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      await SingleButtonAlert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 8) {
      await SingleButtonAlert('비밀번호는 최소 8자리 이상이어야 합니다.');
      return;
    }

    try {
      // ✅ 비밀번호 변경 API 호출
      await changeParentPassword(currentPassword, newPassword);
      
      // ✅ 성공 시 알림 후 로그인 페이지로 이동
      const result = await SingleButtonAlert('비밀번호가 변경되었습니다.');
      if (result.isConfirmed) {
        navigate('/');
      }

      // 입력 필드 초기화
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('❌ 비밀번호 변경 실패:', error.response ? error.response.data : error.message);
      await SingleButtonAlert('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="app-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="auth_2_logo" />
      </div>
      <Card className="p_card-container">
        <h1><strong>비밀번호 변경</strong></h1>
        <div className="input-container">
          <p>현재 비밀번호</p>
          <InputText 
            className="input-field" 
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호를 입력해주세요." 
          />
        </div>
        <div className="input-container">
          <p>새 비밀번호</p>
          <InputText 
            className="input-field" 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호를 입력해주세요." 
          />
        </div>
        <div className="input-container">
          <p>새 비밀번호 확인</p>
          <InputText 
            className="input-field" 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호를 한번 더 입력해주세요." 
          />
        </div>
        <div className="p_button-container">
          <Button 
            label="변경하기" 
            className="find-button2"
            onClick={handlePasswordChange}
          />
        </div>
      </Card>
    </div>
  );
}

export default PasswordChange;
