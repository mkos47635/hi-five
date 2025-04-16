import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import "/src/pages/Parent/ParentCss/ParentVideoSinglePage.css";

function ParentVideoSinglePage() {
  const [date, setDate] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const emotionOptions = [
    { label: '기쁨', value: 'joy' },
    { label: '슬픔', value: 'sadness' },
    { label: '놀람', value: 'surprise' },
    { label: '화남', value: 'anger' },
    { label: '공포', value: 'fear' }
  ];

  const videoOptions = [
    { label: '첫번째 영상', value: 'video1' },
    { label: '두번째 영상', value: 'video2' },
    { label: '세번째 영상', value: 'video3' }
  ];

  return (
    <div className="video-page-container">
      <h1 className="page-title">학습 영상 조회</h1>
      
      <div className="video-section">
        <div className="controls-row">
          <div className="control-item date-picker">
            <label>날짜 선택</label>
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              showIcon={false}
              className="calendar-input simple-calendar"
              placeholder="날짜를 선택하세요"
            />
          </div>
          
          <div className="control-item emotion-picker">
            <label>감정 선택</label>
            <Dropdown
              value={emotion}
              options={emotionOptions}
              onChange={(e) => setEmotion(e.value)}
              placeholder="감정"
              className="dropdown-input"
            />
          </div>
          
          <div className="control-item video-picker">
            <label>영상 선택</label>
            <Dropdown
              value={selectedVideo}
              options={videoOptions}
              onChange={(e) => setSelectedVideo(e.value)}
              placeholder="영상"
              className="dropdown-input"
            />
          </div>
        </div>
        
        <div className="video-container">
          <img 
            src="/user.png" 
            alt="Selected Video"
            className="video-placeholder"
          />
        </div>
      </div>
    </div>
  );
}

export default ParentVideoSinglePage;
