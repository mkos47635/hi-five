import { useState, useRef } from 'react';
import './ChildRegistrationModal.css';
import DoubleButtonAlert from '../common/DoubleButtonAlert';
import SingleButtonAlert from '../common/SingleButtonAlert';
import { registerParentAccount, checkConsultantParentEmail } from "/src/api/userCounselor"; // API 호출 추가
import { uploadFile, TBL_TYPES } from '../../api/file';

const RegistrationModal = ({ onClose }) => {
  const [isReadOnly, setIsReadOnly] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const isSubmitting = useRef(false);
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childBirth: '',
    childGender: '',
    firstConsultDt: '',
    childInterest: '',
    childAdditionalInfo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting.current) return; // 이미 실행 중이면 중단
    isSubmitting.current = true; // 실행 시작
    
    // ✅ 성별 값을 ENUM('M', 'F') 형식으로 변환
    const formattedGender = formData.childGender === 'male' ? 'M' : 'F';

    // ✅ 전화번호 검증 (하이픈 제거 + 길이 확인)
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(formData.parentPhone)) {
      await SingleButtonAlert("전화번호는 하이픈(-) 없이 11자리 숫자로 입력해주세요.");
      return;
    }

    try {
      // ✅ API 호출
      const response = await registerParentAccount({
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        childName: formData.childName,
        childBirth: formData.childBirth,
        childGender: formattedGender,
        firstConsultDt: formData.firstConsultDt,
        childInterest: formData.childInterest,
        childAdditionalInfo: formData.childAdditionalInfo
      });
      
      // 2. 파일이 선택되었다면 파일 업로드 수행
      if (selectedFile && response.childUserId) {
        try {
          await uploadFile(
            [selectedFile],
            [TBL_TYPES.PROFILE_CHILD],  // 프로필 이미지이므로 'P' 타입 사용
            [response.childUserId] // tblId로 생성된 childUserId 사용
          );
        } catch (error) {
          console.error("❌ 프로필 이미지 업로드 실패:", error);
          await SingleButtonAlert("프로필 이미지 업로드에 실패했지만, 회원 등록은 완료되었습니다.");
          onClose();
          return;
        }
      }

      console.log("✅ 회원 등록 성공:", response);
      await SingleButtonAlert('회원 등록이 완료되었습니다.');
      onClose();

      } catch (error) {
      console.error("❌ 회원 등록 실패:", error);
      await SingleButtonAlert("회원 등록 중 오류가 발생했습니다.");
      } finally {
      isSubmitting.current = false;
      }
      };

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    // 이메일 형식 검증 (@ 포함 여부 확인)
    if (!formData.parentEmail.includes("@")) {
      await SingleButtonAlert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    try {
      const response = await checkConsultantParentEmail(formData.parentEmail); // API 호출
      const isAlreadyAccount = response.alreadyAccount;

      if (!isAlreadyAccount) {
        await SingleButtonAlert("사용 가능한 이메일입니다.");
      } else {

        const result = await DoubleButtonAlert("이미 있는 계정입니다.<br>아동을 추가하시겠습니까?");
        if (result.isConfirmed) {
          console.log("아동 추가 진행");

          setFormData({
            ...formData,
            parentName: response.parentName,
            parentPhone: response.parentPhone,
            parentEmail: response.email,
          });
          setIsReadOnly(true);
        } else {
          console.log("아동 추가 취소");
        }
      }
    } catch (error) {
      console.error("❌ 이메일 중복 확인 실패:", error);
      await SingleButtonAlert("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="r-modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="r-modal-header">
          <h2 className="modal-title">회원등록</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="form-container">
          {/* 학부모 정보 섹션 */}
          <section className="info-section">
            <h3 className="section-title">학부모 정보</h3>
            <div className="input-group">
              <div className="r-input-field">
                <label>이메일</label>
                <div className="email-input-container">
                  <input
                      type="email"
                      value={formData.parentEmail || ""}
                      readOnly={isReadOnly}
                      style={{ backgroundColor: isReadOnly ? "#f2f2f2" : "inherit" }}
                      onChange={(e) =>
                          setFormData({ ...formData, parentEmail: e.target.value })
                      }
                  />
                  <button
                      type="button"
                      className="email-check-button"
                      onClick={handleEmailCheck}
                      disabled={isReadOnly} // 이미 확인 후라면 버튼 비활성화
                  >
                    중복확인
                  </button>
                </div>
              </div>
              <div className="input-row">
                <div className="r-input-field">
                  <label>학부모 이름</label>
                  <input
                      type="text"
                      value={formData.parentName || ""}
                      readOnly={isReadOnly}
                      style={{ backgroundColor: isReadOnly ? "#f2f2f2" : "inherit" }}
                      onChange={(e) =>
                          setFormData({ ...formData, parentName: e.target.value })
                      }
                  />
                </div>
                <div className="r-input-field">
                  <label>연락처</label>
                  <input
                      type="text"
                      value={formData.parentPhone || ""}
                      readOnly={isReadOnly}
                      style={{ backgroundColor: isReadOnly ? "#f2f2f2" : "inherit" }}
                      onChange={(e) =>
                          setFormData({ ...formData, parentPhone: e.target.value })
                      }
                  />
                </div>
              </div>
            </div>
            <hr />
          </section>

          {/* 아동 정보 섹션 */}
          <section className="info-section">
            <h3 className="section-title">아동 정보</h3>
            <div className="cchild-info">
              <div className="photo-upload">
                <div className="photo-circle">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Selected preview" className="preview-image" />
                  ) : (
                    <span>사진</span>
                  )}
                </div>
                <div className="upload-controls">
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" style={{ display: 'none' }} />
                  <button type="button" className="file-select-button" onClick={handleFileButtonClick}>
                    파일선택
                  </button>
                  <span className="file-name">{selectedFile ? selectedFile.name : '선택된 파일 없음'}</span>
                </div>
              </div>

              <div className="input-row">
                <div className="r-input-field">
                  <label>아이 이름</label>
                  <input type="text" onChange={(e) => setFormData({...formData, childName: e.target.value})} />
                </div>
                <div className="r-input-field">
                  <label>성별</label>
                  <select onChange={(e) => setFormData({...formData, childGender: e.target.value})}>
                    <option value="">성별을 선택하세요</option>
                    <option value="male">남자</option>
                    <option value="female">여자</option>
                  </select>
                </div>
              </div>

              <div className="r-input-field">
                <label>생년월일</label>
                <input type="date" onChange={(e) => setFormData({...formData, childBirth: e.target.value})} />
              </div>
              <div className="r-input-field">
                <label>첫 상담날짜</label>
                <input type="date" onChange={(e) => setFormData({...formData, firstConsultDt: e.target.value})} />
              </div>
            </div>
            <hr />
          </section>

          {/* 추가 정보 섹션 */}
          <section className="info-section">
            <h3 className="section-title">추가 정보</h3>
            <div className="input-group">
              <div className="r-input-field">
                <label>관심사</label>
                <input type="text" onChange={(e) => setFormData({...formData, childInterest: e.target.value})} />
              </div>
              <div className="r-input-field">
                <label>기타사항</label>
                <input type="text" onChange={(e) => setFormData({...formData, childAdditionalInfo: e.target.value})} />
              </div>
            </div>
            <hr />
          </section>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <button type="submit" className="r-submit-button">
              등록!!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
