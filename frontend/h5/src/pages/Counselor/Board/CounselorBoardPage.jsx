import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CounselorHeader from "../../../components/Counselor/CounselorHeader";
import Footer from "../../../components/common/Footer";
import { getNoticePosts, searchNotices } from '../../../api/boardNotice';
import { getFaqList, searchFaqs } from '../../../api/boardFaq';
import { getQnaList, searchQnas } from '../../../api/boardQna';
import SingleButtonAlert from '../../../components/common/SingleButtonAlert';
import '../Css/CounselorBoardPage.css';


function CounselorBoardPage() {
    const [paActiveTab, setPaActiveTab] = useState("notice");
    const [paSearchCategory, setPaSearchCategory] = useState("title");
    const [isSearching, setIsSearching] = useState(false);  // 검색 모드인지 여부
    const [paSearchTerm, setPaSearchTerm] = useState("");
    const [paCurrentPage, setPaCurrentPage] = useState(1);

    const [noticeData, setNoticeData] = useState([]);
    const [faqData, setFaqData] = useState([]);
    const [qnaData, setQnaData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [faqLoading, setFaqLoading] = useState(false);
    const [qnaLoading, setQnaLoading] = useState(false);
    const paItemsPerPage = 6;
  
    const navigate = useNavigate();

    // 검색 API 호출 함수
    const handleSearch = async () => {
        if (!paSearchTerm.trim()) {
            await SingleButtonAlert('검색어를 입력해주세요.');
            return;
        }
    
        try {
            setIsSearching(true);
            const searchType = paSearchCategory === 'writer' ? 'writer' : 'title';
            
            if (paActiveTab === "notice") {
                setIsLoading(true);
    
                const response = await searchNotices(
                    paSearchTerm,
                    searchType,
                    paCurrentPage - 1,
                    paItemsPerPage
                );
    
                const formattedData = response.notices.map((item, index) => ({
                    no: response.pagination.totalElements - ((paCurrentPage - 1) * paItemsPerPage + index),  // 역순 번호 부여
                    id: item.id,
                    title: item.title,
                    writer: item.name || "운영자",
                    views: item.viewCnt || 0,
                    date: new Date(item.createDttm).toISOString().split('T')[0]
                }));
    
                setNoticeData(formattedData);
                setTotalPages(response.pagination.totalPages);
                setIsLoading(false);
            } else if (paActiveTab === "faq") {
                setFaqLoading(true);
                setIsSearching(true);
    
                const response = await searchFaqs(
                    paSearchTerm,
                    searchType,
                    paCurrentPage - 1,
                    paItemsPerPage
                );
    
                const formattedData = response.faqs.map((item, index) => ({
                    no: response.pagination.totalElements - ((paCurrentPage - 1) * paItemsPerPage + index),  // 역순 번호 부여
                    id: item.id,
                    type: item.type || "기타",
                    title: item.title,
                    writer: item.name || "운영자"
                }));
    
                setFaqData(formattedData);
                setTotalPages(response.pagination.totalPages);
                setFaqLoading(false);
            }
    
        } catch (error) {
            console.error("검색 에러:", error);
            await SingleButtonAlert(
                error.response?.data?.message || '검색 중 오류가 발생했습니다.'
            );
        } finally {
            if (paActiveTab === "notice") setIsLoading(false);
            if (paActiveTab === "faq") setFaqLoading(false);
        }
    };

    const fetchNoticeData = async () => {
      try {
          setIsLoading(true);
          setIsSearching(false);  // 검색 모드 해제

          const response = await getNoticePosts(
              paCurrentPage - 1, 
              paItemsPerPage
          );
          
          const formattedData = response.notices.map((item, index) => ({
              no: response.pagination.totalElements - (paCurrentPage - 1) * paItemsPerPage - index,
              id: item.id, // 실제 데이터베이스 ID
              title: item.title,
              writer: item.name || "운영자",
              views: item.viewCnt || 0,
              date: new Date(item.createDttm).toISOString().split('T')[0]
          }));

          setNoticeData(formattedData);
          setTotalPages(response.pagination.totalPages);

      } catch (error) {
          console.error("에러 상세:", error); // 디버깅용 로그 추가
          await SingleButtonAlert(
              error.response?.data?.message || '공지사항을 불러오는데 실패했습니다.'
          );
      } finally {
          setIsLoading(false);
      }
    };

    const fetchFaqData = async () => {
        try {
          setFaqLoading(true);
          const response = await getFaqList(paCurrentPage - 1, paItemsPerPage);
          
          const formattedData = response.faqs.map((item, index) => ({
            no: response.pagination.totalElements - (paCurrentPage - 1) * paItemsPerPage - index,
            id: item.id, // 실제 데이터베이스 ID
            type: item.type || "기타",
            title: item.title,
            writer: item.name || "운영자",
          }));
      
          setFaqData(formattedData);
          setTotalPages(response.pagination.totalPages);
        } catch (error) {
          console.error("FAQ 목록 조회 실패:", error);
          await SingleButtonAlert(
            error.response?.data?.message || 'FAQ 목록을 불러오는데 실패했습니다.'
          );
        } finally {
          setFaqLoading(false);
        }
      };

      const fetchQnaData = async () => {
        try {
          setQnaLoading(true);
          setIsSearching(false);  // 검색 모드 해제
          
          const response = await getQnaList(paCurrentPage - 1, paItemsPerPage);
          
          const formattedData = response.qnaList.map((item, index) => ({
            no: response.pagination.totalElements - (paCurrentPage - 1) * paItemsPerPage - index,
            id: item.id, // 실제 데이터베이스 ID
            title: item.title,
            writer: item.name || "익명",
            status: item.answerCnt > 0 ? "답변완료" : "미답변",
            date: new Date(item.createDttm).toISOString().split('T')[0]
          }));
      
          setQnaData(formattedData);
          setTotalPages(response.pagination.totalPages);
      
        } catch (error) {
          console.error("QnA 목록 조회 실패:", error);
          await SingleButtonAlert(
            error.response?.data?.message || 'QnA 목록을 불러오는데 실패했습니다.'
          );
        } finally {
          setQnaLoading(false);
        }
      };

    useEffect(() => {
        if (paActiveTab === "notice" && !isSearching) {
            fetchNoticeData();
        }
    }, [paCurrentPage, paActiveTab, isSearching]);

    useEffect(() => {
        if (paActiveTab === "faq" && !isSearching) {
          fetchFaqData();
        }
      }, [paCurrentPage, paActiveTab, isSearching]);

    useEffect(() => {
    if (paActiveTab === "qna" && !isSearching) {
        fetchQnaData();
    }
    }, [paCurrentPage, paActiveTab, isSearching]);
  
    let paBoardData;
    let paTitle;
    if (paActiveTab === "notice") {
      paBoardData = noticeData;
      paTitle = "공지사항";
    } else if (paActiveTab === "faq") {
      paBoardData = faqData;
      paTitle = "FAQ";
    } else {
      paBoardData = qnaData;
      paTitle = "질문";
    }
  
    // paFilteredData 수정
    const paFilteredData = (paActiveTab === "notice" || paActiveTab === "faq" || paActiveTab === "qna")
        ? paBoardData
        : paBoardData;
    
  
    const paPageData = paFilteredData;
    const emptyRowsCount = paItemsPerPage - paPageData.length;
  
    const handleTabClick = (tabName) => {
        setPaActiveTab(tabName);
        setPaSearchTerm("");
        setPaSearchCategory("title");
        setPaCurrentPage(1);
        setIsSearching(false);
    };
  
    const handleSearchChange = (e) => {
        setPaSearchTerm(e.target.value);
        setPaCurrentPage(1);
        
        // 검색어가 비어있으면 전체 목록을 보여줌
        if (!e.target.value.trim()) {
            setIsSearching(false);
            if (paActiveTab === "notice") {
                fetchNoticeData();
            } else if (paActiveTab === "faq") {
                fetchFaqData();
            } else if (paActiveTab === "qna") {
                fetchQnaData();
            }
            return;
        }
        
        // 검색 실행
        const searchType = paSearchCategory === 'writer' ? 'writer' : 'title';
        setIsSearching(true);
    
        const timer = setTimeout(async () => {
            try {
                if (paActiveTab === "notice") {
                    setIsLoading(true);
                    const response = await searchNotices(
                        e.target.value,
                        searchType,
                        paCurrentPage - 1,
                        paItemsPerPage
                    );
    
                    const formattedData = response.notices.map((item, index) => ({
                        no: response.pagination.totalElements - ((paCurrentPage - 1) * paItemsPerPage + index),
                        id: item.id,
                        title: item.title,
                        writer: item.name || "운영자",
                        views: item.viewCnt || 0,
                        date: new Date(item.createDttm).toISOString().split('T')[0]
                    }));
    
                    setNoticeData(formattedData);
                    setTotalPages(response.pagination.totalPages);
                    setIsLoading(false);
                } else if (paActiveTab === "faq") {
                    setFaqLoading(true);
                    const response = await searchFaqs(
                        e.target.value,
                        searchType,
                        paCurrentPage - 1,
                        paItemsPerPage
                    );
    
                    const formattedData = response.faqs.map((item, index) => ({
                        no: response.pagination.totalElements - ((paCurrentPage - 1) * paItemsPerPage + index),
                        id: item.id,
                        type: item.type || "기타",
                        title: item.title,
                        writer: item.name || "운영자"
                    }));
    
                    setFaqData(formattedData);
                    setTotalPages(response.pagination.totalPages);
                    setFaqLoading(false);
                } else if (paActiveTab === "qna") {
                    setQnaLoading(true);
                    const response = await searchQnas(
                        e.target.value,
                        searchType,
                        paCurrentPage - 1,
                        paItemsPerPage
                    );
    
                    const formattedData = response.qnaList.map((item, index) => ({
                        no: response.pagination.totalElements - ((paCurrentPage - 1) * paItemsPerPage + index),
                        id: item.id,
                        title: item.title,
                        writer: item.name || "익명",
                        status: item.answerCnt > 0 ? "답변완료" : "미답변",
                        date: new Date(item.createDttm).toISOString().split('T')[0]
                    }));
    
                    setQnaData(formattedData);
                    setTotalPages(response.pagination.totalPages);
                    setQnaLoading(false);
                }
            } catch (error) {
                console.error("검색 에러:", error);
            }
        }, 300);
    
        return () => clearTimeout(timer);
    };
    
  
    const handleCategoryClick = (category) => {
        setPaSearchCategory(category);
        setPaSearchTerm("");
        setPaCurrentPage(1);
        setIsSearching(false);
    };

    // 검색어 입력 시 Enter 키 처리
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
  
    const handlePageChange = (pageNumber) => {
      setPaCurrentPage(pageNumber);
    };
  
    const handlePrevPage = () => {
      setPaCurrentPage((prev) => Math.max(prev - 1, 1));
    };
  
    const handleNextPage = () => {
      setPaCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };
  
    const handleWriteClick = () => {
      if (paActiveTab === "notice") {
        navigate("/counselor/board/notice/write");
      } else if (paActiveTab === "faq") {
        navigate("/counselor/board/faq/write");
      }
    };
  
    const handleRowClick = (type, item) => {
      navigate(`/counselor/board/${type}/${item.id}`);
    };
  
    const colSpan = paActiveTab === "faq" ? 4 : paActiveTab === "qna" ? 5 : 5;
  
    return (
        <div className="co-board-page">
            <CounselorHeader />
            <div>
                <div className="co-board-top-wrapper">
                    <div className="co-board-tabs">
                        <button
                            className={`co-board-tab ${paActiveTab === "notice" ? "co-active-tab" : ""}`}
                            onClick={() => handleTabClick("notice")}
                        >
                            공지사항
                        </button>
                        <button
                            className={`co-board-tab ${paActiveTab === "faq" ? "co-active-tab" : ""}`}
                            onClick={() => handleTabClick("faq")}
                        >
                            FAQ
                        </button>
                        <button
                            className={`co-board-tab ${paActiveTab === "qna" ? "co-active-tab" : ""}`}
                            onClick={() => handleTabClick("qna")}
                        >
                            QNA
                        </button>
                    </div>
                </div>

                <div className="co-board-bottom-wrapper">
                    <div className="co-board-searchbar">
                        <div className="co-board-search-select">
                            <div className="co-board-search-label">
                                {paSearchCategory === "title" ? "제목" : "작성자"} ▼
                            </div>
                            <div className="co-board-search-options">
                                <div
                                    className="co-board-search-option"
                                    onClick={() => handleCategoryClick("title")}
                                >
                                    제목
                                </div>
                                <div
                                    className="co-board-search-option"
                                    onClick={() => handleCategoryClick("writer")}
                                >
                                    작성자
                                </div>
                            </div>
                        </div>

                        <input
                            type="text"
                            className="co-board-search-input"
                            placeholder={`${paTitle} 내 검색`}
                            value={paSearchTerm}
                            onChange={handleSearchChange}
                            onKeyPress={handleSearchKeyPress}
                        />
                        <button className="co-board-search-button" onClick={handleSearch}>검색</button>
                    </div>

                    <div className="co-board-table-header">
                        <h2 className="co-board-table-title">{paTitle}</h2>
                        {(paTitle === "FAQ" || paTitle === "공지사항") && (
                            <button className="co-board-write-button" onClick={handleWriteClick}>
                                글쓰기
                            </button>
                        )}
                    </div>

                    <div className="co-board-table-container">
                        {isLoading ? (
                            <div className="co-board-loading">
                                <div className="co-board-loading-spinner"></div>
                                <p>데이터를 불러오는 중입니다...</p>
                            </div>
                        ) : (
                            <>
                                <table className="co-board-table">
                                    <thead>
                                        <tr>
                                            {paActiveTab === "faq" ? (
                                                <>
                                                    <th style={{ width: "10%" }}>번호</th>
                                                    <th style={{ width: "30%" }}>유형</th>
                                                    <th style={{ width: "40%" }}>제목</th>
                                                    <th style={{ width: "20%" }}>작성자</th>
                                                </>
                                            ) : paActiveTab === "qna" ? (
                                                <>
                                                    <th style={{ width: "10%" }}>번호</th>
                                                    <th style={{ width: "40%" }}>제목</th>
                                                    <th style={{ width: "20%" }}>작성자</th>
                                                    <th style={{ width: "10%" }}>답변상태</th>
                                                    <th style={{ width: "20%" }}>작성일</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th style={{ width: "10%" }}>번호</th>
                                                    <th style={{ width: "40%" }}>제목</th>
                                                    <th style={{ width: "20%" }}>작성자</th>
                                                    <th style={{ width: "10%" }}>조회수</th>
                                                    <th style={{ width: "20%" }}>작성일</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paPageData.length === 0 ? (
                                            <tr>
                                                <td colSpan={colSpan} className="co-empty-row">
                                                    게시글이 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            paPageData.map((item) => {
                                                if (paActiveTab === "faq") {
                                                    return (
                                                        <tr
                                                            key={item.no}
                                                            onClick={() => handleRowClick("faq", item)}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <td>{item.no}</td>
                                                            <td>
                                                                {item.type === "usage"
                                                                ? "이용안내"
                                                                : item.type === "child"
                                                                ? "아동상담/문의"
                                                                : item.type === "center"
                                                                ? "센터이용/문의"
                                                                : "기타"}
                                                            </td>

                                                            <td>{item.title}</td>
                                                            <td>{item.writer}</td>
                                                        </tr>
                                                    );
                                                } else if (paActiveTab === "qna") {
                                                    return (
                                                        <tr
                                                            key={item.no}
                                                            onClick={() => handleRowClick("qna", item)}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <td>{item.no}</td>
                                                            <td>{item.title}</td>
                                                            <td>{item.writer}</td>
                                                            <td>{item.status}</td>
                                                            <td>{item.date}</td>
                                                        </tr>
                                                    );
                                                } else {
                                                    return (
                                                        <tr
                                                            key={item.no}
                                                            onClick={() => handleRowClick("notice", item)}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <td>{item.no}</td>
                                                            <td>{item.title}</td>
                                                            <td>{item.writer}</td>
                                                            <td>{item.views}</td>
                                                            <td>{item.date}</td>
                                                        </tr>
                                                    );
                                                }
                                            })
                                        )}

                                        {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                                            <tr key={`empty-${idx}`}>
                                                <td colSpan={colSpan} className="co-empty-row">
                                                    &nbsp;
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {totalPages > 0 && (
                                    <div className="co-board-pagination">
                                        <button onClick={handlePrevPage} disabled={paCurrentPage === 1}>
                                            이전
                                        </button>
                                        {Array.from({ length: totalPages }).map((_, idx) => {
                                            const pageNum = idx + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={paCurrentPage === pageNum ? "co-active-page" : ""}
                                                    onClick={() => handlePageChange(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={handleNextPage}
                                            disabled={paCurrentPage === totalPages}
                                        >
                                            다음
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default CounselorBoardPage;