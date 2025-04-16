import { Card } from 'primereact/card';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Counselor/Css/CoChildCard.css';
import ChildDetailModal from '../modals/ChildDetailModal';
import defaultImg from '/child/character/angrymi.png'
import { useUserStore } from "/src/store/userStore";

const CoChildCard = ({ id, childName, age, parentName, imageUrl, gender, birthDate, parentPhone, parentEmail, treatmentPeriod, firstConsultDate, interests, notes, onDelete, onUpdate }) => {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isHovered, setIsHovered] = useState(false);
 const navigate = useNavigate();

 const handleImageError = (e) => {
  e.target.src = defaultImg;  // import한 이미지 사용
};

//  const handleImageChange = (newImageUrl) => {
//   onUpdate(id, { imageUrl: newImageUrl });
//  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStatusClick = () => {
    // childName을 state로 전달하면서 페이지 이동
    useUserStore.getState().setChildData(id, childName);
    navigate('/counselor/children/data');
  };



 return (
   <>
     <div className="file-container">
       <div className="file-tab"></div>
       <Card className="co-child-card">
         <div className="co-card-content">
           <div className="co-image-section"
                onClick={() => setIsModalOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    cursor: isHovered ? 'pointer' : 'none'
                }}
           >
             <img src={imageUrl || defaultImg} alt={childName} className="co-child-image" onError={handleImageError}/>
           </div>
           <div className="co-info-section">
             <div className="co-info-item">
               <h3>{childName}</h3>
               <p>{age}살</p>
               <p>{parentName}</p>
             </div>
             <div 
                className="co-status-badge"
                onClick={() => {
                    setIsModalOpen(false);
                    handleStatusClick();
                }}
                style={{ cursor: 'pointer' }}
              >
                <span><strong>학습 현황</strong></span>
              </div>
           </div>
         </div>
       </Card>
     </div>

     <ChildDetailModal 
       isOpen={isModalOpen}
       onClose={handleModalClose}
       initialChildData={{
         id: id,
         name: childName,
         age: age,
         parentName: parentName,
         imageUrl: imageUrl || defaultImg,
         gender: gender,
         birthDate: birthDate,
         parentPhone: parentPhone,
         parentEmail: parentEmail,
         treatmentPeriod: treatmentPeriod,
         firstConsultDate: firstConsultDate,
         interests: interests,
         notes: notes
       }}
       onDelete={onDelete}
      //  onImageChange={handleImageChange}
       onUpdate={onUpdate}
     />
   </>
 );
};

export default CoChildCard;