import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Checkbox } from "primereact/checkbox";
import { useState, useEffect } from 'react';
import SingleButtonAlert from '/src/components/common/SingleButtonAlert';
import ParentHeader from "../../components/Parent/ParentHeader";
import Footer from "../../components/common/Footer";
import '../Counselor/Css/CounselorMainPage.css';
import { useNavigate } from 'react-router-dom';
import { getParentChildren } from "/src/api/userParent";
import { useUserStore } from "/src/store/userStore";
import { getNoticePosts } from '../../../src/api/boardNotice';

const CounselorMainPage = () => {
  const navigate = useNavigate();  // 페이지 네비게이션을 위한 훅
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [childName, setChildName] = useState("");
  const [notices, setNotices] = useState([]); // 공지사항 상태 추가
  const [isLoading, setIsLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true); // 자동 재생 상태 추가
  const [page, setPage] = useState(0);
  const [numVisible, setNumVisible] = useState(4);

  const userName = useUserStore((state) => state.userName);

  // 자동 재생을 위한 useEffect
  useEffect(() => {
    let interval;
    
    if (autoPlay && notices.length > 0) {
      interval = setInterval(() => {
        // 다음 페이지 계산
        const nextPage = page >= Math.ceil(notices.length / numVisible) - 1 ? 0 : page + 1;
        setPage(nextPage);
      }, 4000); // 3초마다 실행
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [page, notices.length, numVisible, autoPlay]);

  // 마우스 오버/아웃 핸들러 추가
  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  const handlePageChange = (e) => {
    // 마지막 페이지에서 다음으로 가면 처음으로
    // 첫 페이지에서 이전으로 가면 마지막으로
    const lastPage = Math.ceil(notices.length / numVisible) - 1;
    
    if (e.page < 0) {
      setPage(lastPage);
    } else if (e.page > lastPage) {
      setPage(0);
    } else {
      setPage(e.page);
    }
  };

  const onIngredientChange = (e, child) => {
    setSelectedIngredient(e.checked ? e.value : "");
    const { checked } = e;
    if (checked) {
      useUserStore.getState().setChildData(child.childUserId, child.childUserName);
      setChildName(child.childUserName);
    } else {
      useUserStore.getState().setChildData(null, "");
      setChildName(child.childUserName);
    }
  };

  const handleOpenChildPage = async () => {
    if(childName===""){
      await SingleButtonAlert("아동을 선택해주세요.");
    }
    else{
        window.open(
          `/child/${useUserStore.getState().childData.childUserId}`,
          'ChildMainPage',
          'left=0,top=0,width=' + screen.width + ',height=' + screen.height
        );
    };
  }

  // 날짜 포맷팅 함수 추가
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const noticeTemplate = (notice) => (
    <Card 
      key={notice.id} 
      className="co_notice_card"
      onClick={() => navigate(`/parent/board/notice/${notice.id}`)}  // 클릭 시 해당 글로 이동
      style={{ cursor: 'pointer' }}  // 마우스 오버 시 포인터 커서 표시
    >
      <div className="co_notice_tags">
        <div className="co_tag_group">
          <span className="co_tag co_tag_notice">{notice.type}</span>
          <span className="co_tag co_tag_author">{notice.author}</span>
        </div>
        <span className="co_tag co_tag_new">새글</span>
      </div>
      <h3 className="co_notice_content">{notice.content}</h3>
      <div className="co_notice_date">{notice.date}</div>
    </Card>
  );

  useEffect(() => {
    async function fetchData() {
      try {
        // 아이 목록 가져오기
        const childrenData = await getParentChildren();
        setIngredientsList(childrenData);

        // 공지사항 가져오기
        setIsLoading(true);
        const response = await getNoticePosts(0, 12);
        const noticeData = response.notices.map(notice => ({
          id: notice.id,
          type: '공지사항',
          author: notice.name || '작성자',
          content: notice.title || '제목 없음',
          date: formatDate(notice.createDttm)
        }));
        setNotices(noticeData);
      } catch (error) {
        console.error("❌ 데이터 불러오기 실패:", error);
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
    
    const updateNumVisible = () => {
      const width = window.innerWidth;
      if (width <= 576) {
        setNumVisible(1);
      } else if (width <= 768) {
        setNumVisible(2);
      } else if (width <= 1100) {
        setNumVisible(3);
      } else {
        setNumVisible(4);
      }
    };

    updateNumVisible();
    window.addEventListener('resize', updateNumVisible);

    return () => {
      window.removeEventListener('resize', updateNumVisible);
    };
  }, []);

  const totalPages = Math.ceil(notices.length / numVisible);
  const currentPage = page + 1;

  const responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 4
    },
    {
      breakpoint: '1100px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '576px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  return (
    <>
    <div className="co_page_wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ParentHeader />
      <main className='co_main'>
        <section className="co_hero_section">
          <div className="co_inner_left">
            <div className="co_hero_content">
              <h1 className="co_service_title">
                안녕하세요.
              </h1>
              <h2 className="co_counselor_intro">
                <span className="co_highlight">{userName}</span> 학부모님.
              </h2>
              <p className="co_service_subtitle">감정을 놀이로 전달하는 <span>HI 서비스</span> 입니다.</p>
              <div className="flex flex-wrap gap-5" style={{ marginBottom: '15px' }}>
              {ingredientsList.map((child, index) => (
                <div key={child.childUserId} className="flex align-items-center">
                  <Checkbox
                    inputId={`ingredient${index}`}
                    name="child"
                    value={child.childUserName}
                    onChange={(e) => onIngredientChange(e, child)}
                    checked={
                      useUserStore.getState().childUserId === child.childUserId || 
                      selectedIngredient === child.childUserName
                    }
                  />
                  <label htmlFor={`ingredient${index}`} className="ml-2">{child.childUserName}</label>
                </div>
              ))}
              </div>
              <Button label="게임하러 가기" className="co_schedule_btn" onClick={handleOpenChildPage} />
            </div>
          </div>
          <div className="co_hero_image">
            <img src="/메인이미지.png" alt="description" />
          </div>
        </section>
        <section className='co_notice_wrapper'>
          <div className="co_main_container">
            <section className="co_notice_section">
              <div className="co_notice_header">
                <p className="co_notice_title">새소식</p>
                <div className="co_notice_line"></div>
                <button className="co_notice_line_end" onClick={() => navigate('/parent/board')}>
                  <i className="pi pi-plus"></i>
                  더보기
                </button>
              </div>
              <div className="c-carousel-container"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}>
                {notices.length === 0 ? (
                  <div className="flex justify-center items-center w-full h-48">
                    <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
                  </div>
                ) : (
                  <>
                    <Carousel 
                      value={notices} 
                      numVisible={numVisible} 
                      numScroll={numVisible} 
                      page={page}
                      onPageChange={handlePageChange}
                      itemTemplate={noticeTemplate}
                      showNavigators={true}
                      showIndicators={false}
                      className="c-co_carousel"
                      responsiveOptions={responsiveOptions}
                      loading={isLoading ? "true" : undefined}
                      circular={false}
                      autoplayInterval={0}
                    />
                    <div className="c-custom-indicator">
                      {currentPage}/{totalPages}
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default CounselorMainPage;