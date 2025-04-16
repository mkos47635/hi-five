import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CounselorHeader from "../../components/Counselor/CounselorHeader";
import Footer from "../../components/common/Footer";
import { getNoticePosts } from '../../../src/api/boardNotice';
import '../Counselor/Css/CounselorMainPage.css';

import { useUserStore } from '../../store/userStore';

const CounselorMainPage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [numVisible, setNumVisible] = useState(4);
  const [autoPlay, setAutoPlay] = useState(true);

  const userName = useUserStore((state) => state.userName);

  useEffect(() => {
    let interval;

    if (autoPlay && notices.length > 0) {
      interval = setInterval(() => {
        const nextPage = page >= Math.ceil(notices.length / numVisible) - 1 ? 0 : page + 1;
        setPage(nextPage);
      }, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [page, notices.length, numVisible, autoPlay]);

  const handleMouseEnter = () => setAutoPlay(false);
  const handleMouseLeave = () => setAutoPlay(true);

  const handlePageChange = (e) => {
    const lastPage = Math.ceil(notices.length / numVisible) - 1;
    if (e.page < 0) {
      setPage(lastPage);
    } else if (e.page > lastPage) {
      setPage(0);
    } else {
      setPage(e.page);
    }
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        const response = await getNoticePosts(0, 12);

        const noticeData = response.notices.map(notice => ({
          id: notice.id,
          type: '공지사항',
          author: notice.name || '작성자',
          content: notice.title || '제목 없음',
          date: formatDate(notice.createDttm)
        }));

        console.log("📢 Notices fetched:", noticeData);
        setNotices(noticeData);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const totalPages = Math.ceil(notices.length / numVisible);
  const currentPage = page + 1;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const updateNumVisible = () => {
      const width = window.innerWidth;
      if (width <= 576) setNumVisible(1);
      else if (width <= 768) setNumVisible(2);
      else if (width <= 1100) setNumVisible(3);
      else setNumVisible(4);
    };

    updateNumVisible();
    window.addEventListener('resize', updateNumVisible);
    return () => window.removeEventListener('resize', updateNumVisible);
  }, []);

  const noticeTemplate = (notice) => (
      <Card
          key={notice.id}
          className="co_notice_card"
          onClick={() => navigate(`/counselor/board/notice/${notice.id}`)}
          style={{ cursor: 'pointer' }}
      >
        <div className="co_notice_tags">
          <div className="co_tag_group">
            <span className="co_tag co_tag_notice">{notice.type}</span>
            <span className="co_tag co_tag_author">{notice.author}</span>
          </div>
          {<span className="co_tag co_tag_new">새글</span>}
        </div>
        <h3 className="co_notice_content">{notice.content}</h3>
        <div className="co_notice_date">{notice.date}</div>
      </Card>
  );

  return (
      <div className="co_page_wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* 헤더 */}
        <CounselorHeader />

        <main className='co_main'>
          {/* 히어로 섹션 - 상담사 소개 */}
          <section className="co_hero_section">
            <div className="co_inner_left">
              <div className="co_hero_content">
                <h1 className="co_service_title">안녕하세요.</h1>
                <h2 className="co_counselor_intro">
                  <span className="co_highlight">{userName}</span> 상담사님.
                </h2>
                <p className="co_service_subtitle">
                  감정을 놀이로 전달하는 <span>HI 서비스</span> 입니다.
                </p>
                <Button
                    label="상담일정 보러가기"
                    className="co_schedule_btn"
                    onClick={() => navigate('/counselor/schedule')}
                />
              </div>
            </div>
            <div className="co_hero_image">
              <img src="/메인이미지.png" alt="description" />
            </div>
          </section>

          {/* 공지사항 섹션 */}
          <section className='co_notice_wrapper'>
            <div className="co_main_container">
              <section className="co_notice_section">
                <div className="co_notice_header">
                  <p className="co_notice_title">새소식</p>
                  <div className="co_notice_line"></div>
                  <button
                      className="co_notice_line_end"
                      onClick={() => navigate('/counselor/board')}
                  >
                    <i className="pi pi-plus"></i> 더보기
                  </button>
                </div>

                <div
                    className="c-carousel-container"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
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
                            loading={isLoading}
                            circular={false}
                            autoplayInterval={0}
                            responsiveOptions={[
                              { breakpoint: '1400px', numVisible: 4, numScroll: 4 },
                              { breakpoint: '1100px', numVisible: 3, numScroll: 3 },
                              { breakpoint: '768px', numVisible: 2, numScroll: 2 },
                              { breakpoint: '576px', numVisible: 1, numScroll: 1 }
                            ]}
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
  );
};

export default CounselorMainPage;
