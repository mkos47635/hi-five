import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import CounselorHeader from "/src/components/Counselor/CounselorHeader";
import SingleButtonAlert from '../../../components/common/SingleButtonAlert';
import DoubleButtonAlert from "../../../components/common/DoubleButtonAlert";
import { getNoticeDetail, deleteNotice } from '../../../api/boardNotice';
import { getFaqDetail, deleteFaq } from '../../../api/boardFaq';
import {getQnaDetail, deleteQna, updateQnaComment, createQnaAnswer, deleteQnaComment} from '../../../api/boardQna';
import { getFileUrl, downloadFile, deleteFile } from '../../../api/file';
import '../Css/CounselorBoardDetailPage.css';
import { replaceEditorPlaceholders } from "../../../store/boardStore.js";
import {useUserStore} from "../../../store/userStore.js";

function CounselorBoardDetailPage() {
  const navigate = useNavigate();
  const { type, no } = useParams();

  // 게시글 데이터 (Notice, FAQ, QnA)
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 파일 상태: 에디터 이미지와 첨부파일
  const [editorFileUrls, setEditorFileUrls] = useState([]);
  const [attachmentFileUrls, setAttachmentFileUrls] = useState([]);
  const [deletedFileIds] = useState([]);
  const [setFileError] = useState(null);

  // QnA 관련 (답변)
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [qnaData, setQnaData] = useState(null);

  const viewCountUpdated = useRef(false);

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerContent, setEditedAnswerContent] = useState("");
  const editableRef = useRef(null);

  const userName = useUserStore((state) => state.userName);


  const handleBack = () => {
    navigate(-1);
  };

  // 파일 URL 조회 (공통)
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

  // 게시글 상세 데이터 조회 (타입별 분기)
  const fetchDetail = async (id) => {
    try {
      setIsLoading(true);
      let response, formattedData;
      if (type === "notice") {
        response = await getNoticeDetail(id);
        formattedData = {
          no: response.id,
          title: response.title,
          content: response.content, // 에디터 이미지 placeholder 포함
          writer: response.name || "운영자",
          views: response.viewCnt || 0,
          date: new Date(response.createDttm).toISOString().split("T")[0],
        };
        setPostData(formattedData);
        await fetchFileUrls('NE', id, setEditorFileUrls);
        await fetchFileUrls('NF', id, setAttachmentFileUrls);
      } else if (type === "faq") {
        response = await getFaqDetail(id);
        formattedData = {
          no: response.id,
          title: response.title,
          content: response.faqAnswer,
          writer: response.name || "운영자",
        };
        setPostData(formattedData);
        await fetchFileUrls('FE', id, setEditorFileUrls);
        await fetchFileUrls('FF', id, setAttachmentFileUrls);
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

        await fetchFileUrls('QE', id, setEditorFileUrls);
        await fetchFileUrls('QF', id, setAttachmentFileUrls);
      }
    } catch (error) {
      console.error("상세 데이터 조회 실패:", error);
      await SingleButtonAlert(error.response?.data?.message || "데이터를 불러오는데 실패했습니다.");
      navigate(-1);
    } finally {
      setIsLoading(false);
      viewCountUpdated.current = true;
    }
  };

  // useEffect: 초기 데이터 로드
  useEffect(() => {
    if (no && !viewCountUpdated.current) {
      fetchDetail(no);
    }
  }, [no, type]);

  // useEffect: 에디터 파일 URL이 업데이트되면 콘텐츠 내 placeholder 치환
  useEffect(() => {
    if (postData && editorFileUrls.length > 0 && postData.content.includes("__EDITOR_IMAGE_PLACEHOLDER_")) {
      setPostData(prev => ({ ...prev, content: replaceEditorPlaceholders(prev.content, editorFileUrls) }));
    }
  }, [editorFileUrls, postData]);

  // Relative time 계산 함수
  const getTimeAgo = (dateString) => {
    if (!dateString) return "방금 전";
    try {
      const now = new Date();
      const past = new Date(dateString);
      if (isNaN(past.getTime())) return "방금 전";
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
      console.error("날짜 변환 중 오류:", error);
      return "방금 전";
    }
  };

  // Post 삭제: 게시글과 관련 파일 모두 삭제
  const handleDelete = async () => {
    try {
      const result = await DoubleButtonAlert("정말 삭제 하시겠습니까?");
      if (result.isConfirmed) {
        // 먼저, 첨부파일 및 에디터 파일 모두 삭제
        const allFiles = [...(attachmentFileUrls || []), ...(editorFileUrls || [])];
        const deletePromises = allFiles.map(file => deleteFile(file.fileId));
        await Promise.all(deletePromises);
        // 그 후 게시글 삭제 (타입별 분기)
        if (type === "notice") {
          await deleteNotice(no);
        } else if (type === "faq") {
          await deleteFaq(no);
        } else if (type === "qna") {
          await deleteQna(no);
        }
        await SingleButtonAlert("성공적으로 삭제되었습니다.");
        navigate("/counselor/board");
      }
    } catch (error) {
      console.error("삭제 처리 중 오류 발생:", error);
      if (error.response?.status === 403) {
        await SingleButtonAlert("삭제 권한이 없습니다.");
      } else {
        const errorMessage =
            type === "notice"
                ? "공지사항 삭제에 실패했습니다."
                : type === "faq"
                    ? "FAQ 삭제에 실패했습니다."
                    : "QnA 삭제에 실패했습니다.";
        await SingleButtonAlert(error.response?.data?.message || errorMessage);
      }
    }
  };

  const handleAnswerEdit = (id) => {
    const targetAnswer = answers.find(a => a.id === id);
    if (targetAnswer) {
      setEditedAnswerContent(targetAnswer.content || ""); // 먼저 내용을 설정
      setEditingAnswerId(id); // 그 다음 editing 상태를 변경
    }
  };

  useEffect(() => {
    if (editingAnswerId && editableRef.current) {
      editableRef.current.textContent = editedAnswerContent;
      editableRef.current.focus();
      // 커서를 끝으로 이동
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [editingAnswerId]);

  const handleQnaCommentEdit = async (qnaCommentId) => {
    try {
      if (!editedAnswerContent.trim()) {
        await SingleButtonAlert('수정할 내용을 입력해주세요.');
        return;
      }

      await updateQnaComment(qnaCommentId, editedAnswerContent);

      setAnswers(answers.map(answer =>
          answer.id === qnaCommentId
              ? { ...answer, content: editedAnswerContent }
              : answer
      ));

      setEditingAnswerId(null);
      setEditedAnswerContent("");
      await SingleButtonAlert('댓글이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
      await SingleButtonAlert(
          error.response?.data?.message || 'QnA 댓글 수정에 실패했습니다.'
      );
    }
  };

  const handleAnswerSubmit = async () => {
    try {
      if (!answer.trim()) {
        await SingleButtonAlert('답변 내용을 입력해주세요.');
        return;
      }

      if (answers.length > 0) {
        await SingleButtonAlert('이미 답변이 작성되었습니다.');
        return;
      }

      const response = await createQnaAnswer(no, answer);

      // 서버 응답의 createDttm 사용
      setAnswers([{
        id: response.id,
        content: answer,
        writer: response.name || "상담사",
        createDttm: response.createDttm, // 서버에서 받은 시간 사용
        time: getTimeAgo(response.createDttm), // 서버 시간 기준으로 계산
        // profileImageUrl: response.profileImageUrl || "/no.png"
      }]);

      setQnaData(prev => ({
        ...prev,
        status: "답변완료"
      }));

      await SingleButtonAlert('답변이 등록되었습니다.');
      setAnswer('');

    } catch (error) {
      console.error('답글 작성 중 오류 발생:', error);
      await SingleButtonAlert(
          error.response?.data?.message || 'QnA 답글 작성에 실패했습니다.'
      );
    }
  };

  const handleQnaCommentDelete = async (qnaCommentId) => {
    try {
      const result = await DoubleButtonAlert("정말 댓글을 삭제하시겠습니까?");

      if (result.isConfirmed) {
        await deleteQnaComment(qnaCommentId);

        // 답변 목록에서 해당 댓글 제거
        setAnswers([]);

        // QnA 상태를 답변 대기로 변경
        setQnaData(prev => ({
          ...prev,
          status: "답변대기"
        }));

        await SingleButtonAlert('댓글이 성공적으로 삭제되었습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
      await SingleButtonAlert(
          error.response?.data?.message || 'QnA 댓글 삭제에 실패했습니다.'
      );
    }
  };



  // DetailPage 렌더링
  if (isLoading) {
    return (
        <div className="co-detail-page">
          <CounselorHeader />
          <div className="co-detail-container">
            <div className="co-detail-topbar">
              <button className="co-detail-back-btn" onClick={handleBack}>←</button>
              <span className="co-detail-top-title">로딩 중...</span>
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
        <CounselorHeader />
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
                  {(type === "notice" || type === "faq") && postData.writer === userName && (
                      <button
                          onClick={() => navigate(`/counselor/board/${type}/edit/${no}`, { state: { postData } })}
                          className="co-detail-edit-btn"
                      >
                        수정
                      </button>
                  )}
                  {(type === "notice" || type === "faq") && postData.writer === userName && (
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
                    dangerouslySetInnerHTML={{ __html: postData.content }}
                    className="co-detail-content-view"
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
              {/* 답변 영역 */}
              {type === "qna" && (
                  <div className="answer-section">
                    <div className="co-detail-card">
                      <div className="co-detail-answer">
                        <div className="co-detail-answer-header">
                          <h3 className="co-detail-answer-title">답변</h3>
                          {answers.length > 0 && (
                              <div className="co-detail-answer-buttons">
                                {editingAnswerId === answers[0].id ? (
                                    <>
                                      <button
                                          onClick={() => handleQnaCommentEdit(answers[0].id)}
                                          className="co-detail-answer-edit"
                                      >
                                        수정완료
                                      </button>
                                      <button
                                          onClick={() => {
                                            setEditingAnswerId(null);
                                            setEditedAnswerContent("");
                                          }}
                                          className="co-detail-answer-delete"
                                      >
                                        취소
                                      </button>
                                    </>
                                ) : (
                                    <>
                                      <button
                                          onClick={() => handleAnswerEdit(answers[0].id)}
                                          className="co-detail-answer-edit"
                                      >
                                        수정
                                      </button>
                                      <button
                                          onClick={() => handleQnaCommentDelete(answers[0].id)}
                                          className="co-detail-answer-delete"
                                      >
                                        삭제
                                      </button>
                                    </>
                                )}
                              </div>
                          )}
                        </div>
                        {answers.length === 0 ? (
                            <div className='co-detail-answer-input-area-full'>
                              <div className="co-detail-answer-input-area">
                                <div
                                    contentEditable={true}
                                    className="co-detail-answer-input"
                                    onInput={(e) => setAnswer(e.currentTarget.textContent || "")}
                                    suppressContentEditableWarning={true}
                                    placeholder="질문에 대한 답변을 남겨주세요."
                                />
                              </div>
                              <button
                                  onClick={handleAnswerSubmit}
                                  className="co-detail-answer-submit"
                              >
                                답글작성하기
                              </button>
                            </div>
                        ) : (
                            <div className="co-detail-answer-content">
                              <div className="co-detail-answer-info">
                                <img
                                    src={answers[0].profileImageUrl}
                                    alt="프로필"
                                    className='co-detail-answer-info-img'
                                />
                                <span className="co-detail-answer-writer">{answers[0].writer}님</span>
                                <span className="co-detail-answer-time">{answers[0].time}</span>
                              </div>
                              <div
                                  className="co-detail-answer-info-content"
                                  ref={editingAnswerId === answers[0].id ? editableRef : null}
                                  contentEditable={editingAnswerId === answers[0].id}
                                  onInput={(e) => editingAnswerId === answers[0].id && setEditedAnswerContent(e.target.textContent || "")}
                                  suppressContentEditableWarning={true}
                              >
                                {!editingAnswerId && answers[0].content}
                              </div>
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

export default CounselorBoardDetailPage;
