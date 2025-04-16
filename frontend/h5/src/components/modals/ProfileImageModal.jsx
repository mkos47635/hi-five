import { useState, useRef } from 'react';  // useRef 추가
import './ProfileImageModal.css';
import { BsCameraFill } from 'react-icons/bs';
import { BsCloudUpload } from 'react-icons/bs';

const ProfileImageModal = ({ onClose, onImageChange, initialImage }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = async () => {
    if (!selectedFile) return;
    
    // 선택된 이미지의 URL을 부모 컴포넌트로 전달
    onImageChange(previewUrl, selectedFile);
    onClose();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);  // selectedFile 상태 설정
      onImageChange(url, file); // URL과 파일 객체 모두 전달
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(imageUrl);
      onImageChange(imageUrl, file);  // 부모 컴포넌트에 알림
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>
            <BsCameraFill size={30} style={{ marginRight: '2px' }} /> 프로필 사진 변경
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div 
          className="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="m-preview-image" 
            />
          ) : (
            <>
              <div className="upload-icon">
                <BsCloudUpload size={48} color="#666" />
              </div>
              <p>이미지를 드래그하여 업로드하거나</p>
              <p>아래 버튼을 클릭하세요</p>
            </>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button 
          className="file-select-btn"
          onClick={handleButtonClick}
        >
          파일 선택하기
        </button>

        <div className="action-buttons">
          <button 
            className="p-cancel-btn" 
            onClick={onClose}
          >
            취소
          </button>
          <button 
            className="change-btn"
            onClick={handleChange}
            disabled={!selectedFile}
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;