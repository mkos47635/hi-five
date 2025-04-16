import { useState } from 'react';
import ParentHeader from "../../components/Parent/ParentHeader";
import "./ParentBoardPage.css";

/* 샘플 게시글 데이터 - 탭별로 분리 (공지사항, FAQ, 질문) */
const noticeData = [
  { no: 11, title: "새로운 기능 안내", writer: "운영자", views: 128, date: "2025-01-22" },
  { no: 10, title: "새로운 기능 안내", writer: "운영자", views: 128, date: "2025-01-22" },
  { no: 9, title: "새로운 기능 안내", writer: "운영자", views: 128, date: "2025-01-22" },
  { no: 8, title: "새로운 기능 안내", writer: "운영자", views: 128, date: "2025-01-22" },
  { no: 7, title: "새로운 기능 안내", writer: "운영자", views: 128, date: "2025-01-22" },
  { no: 6, title: "새로운 기능 안내", writer: "운영자", views: 128, date: "2025-01-22" },
  { no: 5, title: "새로운 기능 안내", writer: "운영자", views: 128, date: "2025-01-22" },
  { no: 4, title: "점검 공지", writer: "운영자", views: 99, date: "2025-01-18" },
  { no: 3, title: "사이트 사용 가이드", writer: "운영자", views: 64, date: "2025-01-10" },
  { no: 2, title: "새로운 기능 안내", writer: "운영자", views: 128, date: "2025-01-22" },
  { no: 1, title: "계정 관련 FAQ", writer: "운영자", views: 100, date: "2025-01-08" },
  
];

const faqData = [
  { no: 2, title: "자주 묻는 질문 TOP5", writer: "운영자", views: 87, date: "2025-01-21" },
  { no: 1, title: "계정 관련 FAQ", writer: "운영자", views: 100, date: "2025-01-08" },
];

const qnaData = [
  { no: 3, title: "문의드립니다", writer: "홍길동", views: 10, date: "2025-01-23" },
  { no: 2, title: "결제 관련 문의", writer: "김철수", views: 30, date: "2025-01-17" },
  { no: 1, title: "서비스 이용 방법 문의", writer: "이영희", views: 45, date: "2025-01-02" },
];

function ParentBoardPage() {
  /* -----------------------------
   * 탭 전환 state
   * ----------------------------- */
  const [paActiveTab, setPaActiveTab] = useState("notice"); 
  // "notice" | "faq" | "qna"

  /* -----------------------------
   * 검색 기준: title or writer
   * ----------------------------- */
  const [paSearchCategory, setPaSearchCategory] = useState("title");

  /* -----------------------------
   * 검색어
   * ----------------------------- */
  const [paSearchTerm, setPaSearchTerm] = useState("");

  /* -----------------------------
   * 페이지네이션
   * ----------------------------- */
  const [paCurrentPage, setPaCurrentPage] = useState(1);
  const paItemsPerPage = 7; // 페이지 당 표시할 아이템 수

  /* -----------------------------
   * 탭별 데이터 가져오기
   * ----------------------------- */
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

  /* -----------------------------
   * 검색어에 따라 필터링 (카테고리 적용)
   * ----------------------------- */
  const paFilteredData = paBoardData.filter((item) =>
    item[paSearchCategory].toLowerCase().includes(paSearchTerm.toLowerCase())
  );

  /* -----------------------------
   * 페이지네이션 계산
   * ----------------------------- */
  const paTotalItems = paFilteredData.length; 
  const paTotalPages = Math.ceil(paTotalItems / paItemsPerPage);

  const paStartIndex = (paCurrentPage - 1) * paItemsPerPage;
  const paEndIndex = paStartIndex + paItemsPerPage;
  const paPageData = paFilteredData.slice(paStartIndex, paEndIndex);

  /* -----------------------------
   * 이벤트 핸들러
   * ----------------------------- */
  const handleTabClick = (tabName) => {
    setPaActiveTab(tabName);
    setPaSearchTerm("");
    setPaCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setPaSearchTerm(e.target.value);
    setPaCurrentPage(1);
  };

  const handleCategoryClick = (category) => {
    // "title" | "writer"
    setPaSearchCategory(category);
    setPaSearchTerm("");
    setPaCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setPaCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    setPaCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPaCurrentPage((prev) => Math.min(prev + 1, paTotalPages));
  };

  return (
    <div className="pa-board-page">
      <ParentHeader />

      <div className="pa-board-wrapper">
        {/* 탭 영역 */}
        <div className="pa-board-tabs">
          <button
            className={`pa-board-tab ${paActiveTab === "notice" ? "pa-active-tab" : ""}`}
            onClick={() => handleTabClick("notice")}
          >
            공지사항
          </button>
          <button
            className={`pa-board-tab ${paActiveTab === "faq" ? "pa-active-tab" : ""}`}
            onClick={() => handleTabClick("faq")}
          >
            FAQ
          </button>
          <button
            className={`pa-board-tab ${paActiveTab === "qna" ? "pa-active-tab" : ""}`}
            onClick={() => handleTabClick("qna")}
          >
            질문
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="pa-board-searchbar">
          {/* ▼ 드롭다운: 마우스 올리면 “제목”, “작성자” 선택 가능 */}
          <div className="pa-board-search-select">
            <div className="pa-board-search-label">
              {/* 현재 선택된 검색 기준에 따라 표시 */}
              {paSearchCategory === "title" ? "제목" : "작성자"} ▼
            </div>
            <div className="pa-board-search-options">
              {/* 제목 클릭 시 */}
              <div
                className="pa-board-search-option"
                onClick={() => handleCategoryClick("title")}
              >
                제목
              </div>
              {/* 작성자 클릭 시 */}
              <div
                className="pa-board-search-option"
                onClick={() => handleCategoryClick("writer")}
              >
                작성자
              </div>
            </div>
          </div>

          <input
            type="text"
            className="pa-board-search-input"
            placeholder={`${paTitle} 내 검색`}
            value={paSearchTerm}
            onChange={handleSearchChange}
          />
          <button className="pa-board-search-button">
            <span className="pa-search-icon">🔍</span>
          </button>
        </div>

        {/* 테이블 영역 */}
        <div className="pa-board-table-container">
          <h2 className="pa-board-table-title">{paTitle}</h2>
          <table className="pa-board-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {paPageData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="pa-empty-row">
                    게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                paPageData.map((item) => (
                  <tr key={item.no}>
                    <td>{item.no}</td>
                    <td>{item.title}</td>
                    <td>{item.writer}</td>
                    <td>{item.views}</td>
                    <td>{item.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          {paTotalItems > 0 && (
            <div className="pa-board-pagination">
              <button onClick={handlePrevPage} disabled={paCurrentPage === 1}>
                이전
              </button>
              {Array.from({ length: paTotalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    className={paCurrentPage === pageNum ? "pa-active-page" : ""}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={handleNextPage} disabled={paCurrentPage === paTotalPages}>
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParentBoardPage;
