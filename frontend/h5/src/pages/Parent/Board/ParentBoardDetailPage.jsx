import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CounselorHeader from "/src/components/Counselor/CounselorHeader";
import SingleButtonAlert from "../../../components/common/SingleButtonAlert";
import DoubleButtonAlert from "../../../components/common/DoubleButtonAlert";
import { getNoticeDetail, deleteNotice } from "../../../api/boardNotice";
import { getFaqDetail, deleteFaq } from "../../../api/boardFaq";
import { getQnaDetail, deleteQna } from "../../../api/boardQna";
import { getFileUrl, downloadFile, deleteFile } from "../../../api/file";
import "../../Counselor/Css/CounselorBoardDetailPage.css";
import { replaceEditorPlaceholders } from "../../../store/boardStore";
import ParentHeader from "../../../components/Parent/ParentHeader.jsx";
import {useUserStore} from "../../../store/userStore";

function ParentBoardDetailPage() {
  const navigate = useNavigate();
  const { type, no } = useParams();
  const [postData, setPostData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attachmentFileUrls, setAttachmentFileUrls] = useState([]);
  const [editorFileUrls, setEditorFileUrls] = useState([]);
  const [deletedFileIds] = useState([]);
  const [setFileError] = useState(null);

  const viewCountUpdated = useRef(false);

  const userName = useUserStore((state) => state.userName);

  // 상대적 시간 계산 함수
  const getTimeAgo = (dateString) => {
    if (!dateString) return "방금 전";
    try {
      const now = new Date();
      const past = new Date(dateString);
      const diff = now - past;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (minutes < 1) return "방금 전";
      if (minutes < 60) return `${minutes}분 전`;
      if (hours < 24) return `${hours}시간 전`;
      if (days < 7) return `${days}일 전`;
      return past.toLocaleDateString();
    } catch (error) {
      console.error("날짜 변환 오류:", error);
      return "방금 전";
    }
  };

  // 파일 URL 조회 (공통 함수)
  const fetchFileUrls = async (fileType, id, setUrls) => {
    try {
      const response = await getFileUrl(fileType, id);
      if (response) {
        const filtered = Array.isArray(response)
            ? response.filter(file => !deletedFileIds.includes(file.fileId))
            : [response];
        setUrls(filtered);
      }
    } catch (error) {
      console.error("파일 URL 조회 실패:", error);
      setFileError("파일을 불러오는데 실패했습니다.");
    }
  };

  // 초기 데이터 불러오기: 타입별 분기 (Notice, FAQ, QnA)
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        let response, formattedData;
        if (type === "notice") {
          response = await getNoticeDetail(no);
          formattedData = {
            no: response.id,
            title: response.title,
            content: response.content, // 에디터 이미지 placeholder 포함
            writer: response.name || "운영자",
            views: response.viewCnt || 0,
            date: new Date(response.createDttm).toISOString().split("T")[0],
          };
          setPostData(formattedData);
          await fetchFileUrls("NE", response.id, setEditorFileUrls);
          await fetchFileUrls("NF", response.id, setAttachmentFileUrls);
        } else if (type === "faq") {
          response = await getFaqDetail(no);
          formattedData = {
            no: response.id,
            title: response.title,
            content: response.faqAnswer,
            writer: response.name || "운영자",
          };
          setPostData(formattedData);
          await fetchFileUrls("FE", response.id, setEditorFileUrls);
          await fetchFileUrls("FF", response.id, setAttachmentFileUrls);
        } else if (type === "qna") {
          response = await getQnaDetail(no);
          formattedData = {
            no: response.id,
            title: response.title,
            content: response.content,
            writer: response.name || "익명",
            status: response.qnaAnswerResponseList?.length > 0 ? "답변완료" : "미답변",
            date: new Date(response.createDttm).toISOString().split("T")[0],
          };
          setPostData(formattedData);

          // 답변이 있으면 첫 번째 답변만 사용
          if (response.qnaAnswerResponseList && response.qnaAnswerResponseList.length > 0) {
            const firstAnswer = response.qnaAnswerResponseList[0];
            setAnswers([{
              id: firstAnswer.id,
              content: firstAnswer.content,
              writer: firstAnswer.name || "상담사",
              createDttm: firstAnswer.createDttm, // 원본 시간 저장
              time: getTimeAgo(firstAnswer.createDttm), // 상대적 시간으로 변환
              profileImageUrl: firstAnswer.profileImageUrl || "/no.png"
            }]);
          } else {
            setAnswers([]);
          }

          await fetchFileUrls("QE", response.id, setEditorFileUrls);
          await fetchFileUrls("QF", response.id, setAttachmentFileUrls);
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
        await SingleButtonAlert(error.response?.data?.message || "데이터를 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setIsLoading(false);
        viewCountUpdated.current = true;
      }
    }
    if (no && !viewCountUpdated.current) {
      fetchData();
    }
  }, [no, type, navigate]);

  // 에디터 이미지 치환: 게시글 내용에 placeholder가 있으면 실제 URL로 치환
  useEffect(() => {
    if (postData && editorFileUrls.length > 0 && postData.content.includes("__EDITOR_IMAGE_PLACEHOLDER_")) {
      setPostData(prev => ({
        ...prev,
        content: replaceEditorPlaceholders(prev.content, editorFileUrls)
      }));
    }
  }, [editorFileUrls, postData]);

  // 게시글 삭제: 게시글 삭제 시 관련 파일도 함께 삭제
  const handleDelete = async () => {
    try {
      const result = await DoubleButtonAlert("정말 삭제 하시겠습니까?");
      if (result.isConfirmed) {
        // 모든 파일 삭제: 첨부파일 + 에디터 이미지
        const allFiles = [...(attachmentFileUrls || []), ...(editorFileUrls || [])];
        await Promise.all(allFiles.map(file => deleteFile(file.fileId)));
        // 게시글 삭제 (타입별 분기)
        if (type === "notice") {
          await deleteNotice(no);
        } else if (type === "faq") {
          await deleteFaq(no);
        } else if (type === "qna") {
          await deleteQna(no);
        }
        await SingleButtonAlert("성공적으로 삭제되었습니다.");
        navigate("/parent/board");
      }
    } catch (error) {
      console.error("삭제 처리 중 오류 발생:", error);
      await SingleButtonAlert(error.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
        <div className="co-detail-page">
          <CounselorHeader />
          <div className="co-detail-container">
            <div className="co-detail-loading">
              <div className="co-detail-loading-spinner"></div>
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          </div>
        </div>
    );
  }

  if (!postData) {
    return (
        <div className="co-detail-page">
          <CounselorHeader />
          <div className="co-detail-container">
            <div className="co-detail-topbar">
              <button className="co-detail-back-btn" onClick={handleBack}>←</button>
              <span className="co-detail-top-title">게시글 상세보기</span>
            </div>
            <div className="co-detail-card">
              <h2 className="co-detail-post-title">게시글을 찾을 수 없습니다.</h2>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="co-detail-page">
        <ParentHeader />
        <div className="co-detail-container">
          <div className="question-section">
            <div className="co-detail-topbar">
              <button className="co-detail-back-btn" onClick={handleBack}>←</button>
              <span className="co-detail-top-title">
              {type === "notice" ? "공지사항" : type === "faq" ? "FAQ" : "QNA"}
            </span>
            </div>
            <div className="co-detail-card">
              <div className="co-detail-title-section">
                <h2 className="co-detail-post-title">{postData.title}</h2>
                <div className="co-detail-buttons">
                  {type === "qna" && postData.writer === userName && (
                      <button
                          onClick={() => navigate(`/parent/board/${type}/edit/${no}`, { state: { postData } })}
                          className="co-detail-edit-btn"
                      >
                        수정
                      </button>
                  )}
                  {type === 'qna' && postData.writer === userName && (
                      <button onClick={handleDelete} className="co-detail-delete-btn">
                        삭제
                      </button>
                  )}
                </div>
              </div>
              {(type === "notice" || type === "qna") && (
                  <div className="co-detail-info-text">
                    <span><strong>작성자:</strong> {postData.writer}</span>
                    {type === "qna" && <span> | <strong>답변 상태:</strong> {postData.status}</span>}
                    <span> | <strong>작성일:</strong> {postData.date}</span>
                    {type === "notice" && <span> | <strong>조회수:</strong> {postData.views}회</span>}
                  </div>
              )}
              <div className="co-detail-content">
                <div
                    className="co-detail-content-view"
                    dangerouslySetInnerHTML={{ __html: postData.content }}
                />
              </div>
              {/* 첨부파일 영역 */}
              <div className="co-detail-file">
                <div className="co-detail-file-list">
                  <h4>첨부파일</h4>
                  <div className="co-detail-file-buttons">
                    {attachmentFileUrls && attachmentFileUrls.length > 0 ? (
                        attachmentFileUrls.map((file, index) => (
                            <button
                                key={index}
                                onClick={async () => {
                                  try {
                                    await downloadFile(file.fileId, file.fileName);
                                  } catch (error) {
                                    console.error("파일 다운로드 실패:", error);
                                    await SingleButtonAlert("파일 다운로드에 실패했습니다.");
                                  }
                                }}
                                className="co-detail-file-download-btn"
                            >
                              <span className="p-file-name">{file.fileName}</span>
                            </button>
                        ))
                    ) : (
                        <p>첨부파일이 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
              {/* QnA의 경우 답변 영역 (있다면) */}
              {type === "qna" && (
                  <div className="answer-section">
                    <div className="co-detail-card">
                      <div className="co-detail-answer">
                        <div className="co-detail-answer-header">
                          <h3 className="co-detail-answer-title">답변</h3>
                        </div>
                        {answers.length > 0 ? (
                            answers.map((ans) => (
                                <div key={ans.id} className="co-detail-answer-content">
                                  <div className="co-detail-answer-info">
                                    <img src={ans.profileImageUrl || "/no.png"} alt="프로필" className="co-detail-answer-info-img" />
                                    <span className="co-detail-answer-writer">{ans.writer}</span>
                                    <span className="co-detail-answer-time">{ans.time}</span>
                                  </div>
                                  <div className="co-detail-answer-info-content">
                                    {ans.content}
                                  </div>
                                </div>
                            ))
                        ) : (
                            <div className="co-detail-answer-input-area">
                              <p className="co-detail-no-answer">아직 답변이 없습니다.</p>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default ParentBoardDetailPage;
