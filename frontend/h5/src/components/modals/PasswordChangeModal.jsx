import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SingleButtonAlert from '../common/SingleButtonAlert';
import './PasswordChangeModal.css';
import { changeParentPassword } from '/src/api/userParent';
import { changeConsultantPassword } from '/src/api/userCounselor';

const PasswordChangeModal = ({ isOpen, onClose, role }) => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    useEffect(() => {
        validatePassword(newPassword);
    }, [newPassword]);

    const validatePassword = (password) => {
        const isValid = password.length >= 8 && 
                       /[a-zA-Z]/.test(password) && 
                       /[0-9]/.test(password) && 
                       /[!@#$%^&*(),.?":{}|<>]/.test(password);
        setIsPasswordValid(isValid);
    };

    const isConfirmValid = newPassword === confirmPassword;

    const handleSubmit = async () => {
        try {
            // 비밀번호 변경 api
            if(role==="parent"){
                await changeParentPassword(currentPassword, confirmPassword);
            }
            else{
                await changeConsultantPassword(currentPassword, confirmPassword);
            }
            await SingleButtonAlert('비밀번호가 변경되었습니다.');
            onClose();
            // 폼 초기화
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('비밀번호 변경 실패:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="co-modal-overlay">
            <div className="co-modal-content">
                <div className="co-modal-header">
                    <h2>비밀번호 변경</h2>
                    <button className="co-modal-close" onClick={onClose}>×</button>
                </div>
                <div className="co-modal-body">
                    <div className="co-modal-input-group">
                        <label>현재 비밀번호</label>
                        <div className="co-password-input-container">
                            <input 
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button 
                                className="co-password-toggle"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                <i className={`pi ${showCurrentPassword ? 'pi-eye-slash' : 'pi-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    <div className="co-modal-input-group">
                        <label>새 비밀번호</label>
                        <div className="co-password-input-container">
                            <input 
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button 
                                className="co-password-toggle"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                <i className={`pi ${showNewPassword ? 'pi-eye-slash' : 'pi-eye'}`}></i>
                            </button>
                        </div>
                        {newPassword && !isPasswordValid && (
                            <p className="co-validation-message">
                                영문, 숫자, 특수문자를 포함한 8자 이상 입력해주세요.
                            </p>
                        )}
                    </div>
                    <div className="co-modal-input-group">
                        <label>새 비밀번호 확인</label>
                        <div className="co-password-input-container">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button 
                                className="co-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <i className={`pi ${showConfirmPassword ? 'pi-eye-slash' : 'pi-eye'}`}></i>
                            </button>
                        </div>
                        {confirmPassword && !isConfirmValid && (
                            <p className="co-validation-message">비밀번호가 일치하지 않습니다.</p>
                        )}
                    </div>
                </div>
                <div className="co-modal-footer">
                    <button className="co-modal-cancel" onClick={onClose}>취소</button>
                    <button 
                        className="co-modal-submit"
                        disabled={!isPasswordValid || !isConfirmValid || !currentPassword}
                        onClick={handleSubmit}
                    >
                        변경하기
                    </button>
                </div>
            </div>
        </div>
    );
};

PasswordChangeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    role: PropTypes.func.isRequired,
};

export default PasswordChangeModal;