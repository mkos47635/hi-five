import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Editor } from "primereact/editor";
import CounselorHeader from "/src/components/Counselor/CounselorHeader";
import SingleButtonAlert from "/src/components/common/SingleButtonAlert";
import DoubleButtonAlert from "../../../components/common/DoubleButtonAlert";
import { uploadFile, getFileUrl, deleteFile, TBL_TYPES } from "../../../api/file";
import { base64ToFile, extractAndReplaceEditorImages } from "../../../store/boardStore";
import "../../Counselor/Css/CounselorBoardNoticeWritePage.css";
import {getQnaDetail, updateQna} from "../../../api/boardQna.jsx";

function ParentBoardEditPage() {
    const { no, type } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // 수정 전 데이터가 전달되었는지 확인 (DetailPage에서 state로 넘겨줌)
    const initialData = location.state?.postData || null;

    // 폼 상태 (초기값은 전달된 데이터가 있으면 사용)
    const [title, setTitle] = useState(initialData ? initialData.title : "");
    const [text, setText] = useState(initialData ? initialData.content : "");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useRef(null);

    // 기존 파일 상태: 에디터 이미지와 첨부파일
    const [editorFileUrls, setEditorFileUrls] = useState([]);
    const [attachmentFileUrls, setAttachmentFileUrls] = useState([]);

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const validateForm = () => {
        if (!title.trim()) {
            showToast("warn", "알림", "제목을 입력해주세요.");
            return false;
        }
        if (!text.trim()) {
            showToast("warn", "알림", "내용을 입력해주세요.");
            return false;
        }
        return true;
    };

    // 기존 첨부파일 불러오기
    const fetchAttachmentFiles = async (id) => {
        try {
            const response = await getFileUrl(TBL_TYPES.QNA_FILE, id);
            if (response) {
                const files = Array.isArray(response) ? response : [response];
                setAttachmentFileUrls(files);
            }
        } catch (error) {
            console.error("첨부파일 조회 실패:", error);
        }
    };

    // 기존 에디터 이미지 불러오기
    const fetchEditorFiles = async (id) => {
        try {
            const response = await getFileUrl(TBL_TYPES.QNA_EDITOR, id);
            if (response) {
                const files = Array.isArray(response) ? response : [response];
                setEditorFileUrls(files);
            }
        } catch (error) {
            console.error("에디터 이미지 조회 실패:", error);
        }
    };

    // 초기 데이터 불러오기
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setText(initialData.content);
            fetchAttachmentFiles(no);
            fetchEditorFiles(no);
        } else {
            async function fetchData() {
                try {
                    const response = await getQnaDetail(no); // Notice API, 혹은 type에 따라 분기 가능
                    setTitle(response.title);
                    setText(response.content);
                    fetchAttachmentFiles(response.id);
                    fetchEditorFiles(response.id);
                } catch (error) {
                    console.error("공지사항 상세 조회 실패:", error);
                    await SingleButtonAlert("공지사항 데이터를 불러오는데 실패했습니다.");
                    navigate(-1);
                }
            }
            fetchData();
        }
    }, [initialData, no, navigate, type]);

    // handleFileDelete: 파일 삭제 API 호출 후 상태 업데이트
    const handleFileDelete = async (fileId) => {
        console.log("삭제 시도하는 fileId:", fileId);
        try {
            await deleteFile(fileId);
            console.log("✅ 파일 삭제 API 호출 성공");
            // 첨부파일과 에디터 이미지 모두 업데이트 (필요하다면 분리)
            setAttachmentFileUrls(prev => prev.filter(file => file.fileId !== fileId));
            setEditorFileUrls(prev => prev.filter(file => file.fileId !== fileId));
        } catch (error) {
            console.error("파일 삭제 중 오류:", error);
            await SingleButtonAlert("파일 삭제에 실패했습니다.");
        }
    };

    // 기존 이미지 placeholder와 충돌 문제 해결: 기존 콘텐츠에서 최대 인덱스 계산
    const getMaxEditorImageIndex = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const imgTags = doc.querySelectorAll("img");
        let maxIndex = -1;
        const regex = /editor_image_(\d+)\./;
        imgTags.forEach((img) => {
            const src = img.getAttribute("src");
            if (src) {
                const match = regex.exec(src);
                if (match && match[1]) {
                    const num = parseInt(match[1], 10);
                    if (num > maxIndex) {
                        maxIndex = num;
                    }
                }
            }
        });
        return maxIndex + 1;
    };

    // 현재 에디터 콘텐츠 내의 이미지 URL 추출 (삭제된 이미지 감지용)
    const extractImageUrlsFromHtml = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const imgTags = doc.querySelectorAll("img");
        const urls = [];
        imgTags.forEach(img => {
            const src = img.getAttribute("src");
            if (src) urls.push(src);
        });
        return urls;
    };

    // handleSubmit: 수정 제출 처리 (에디터 이미지 업로드, 첨부파일 업로드, 삭제 처리)
    const handleSubmit = async () => {
        try {
            if (!validateForm()) return;
            if (isSubmitting) return;
            setIsSubmitting(true);

            // 계산: 기존 콘텐츠에 있는 에디터 이미지의 최대 인덱스
            const startIndex = getMaxEditorImageIndex(text);

            // 에디터 내 Base64 이미지 추출 및 placeholder 치환 (startIndex 사용)
            const { modifiedContent, imageDataList } = extractAndReplaceEditorImages(text, startIndex);
            let finalContent = modifiedContent;

            // **추가**: 현재 에디터 콘텐츠의 실제 이미지 URL 추출
            const currentEditorUrls = extractImageUrlsFromHtml(finalContent);
            // 기존 editorFileUrls 중, 현재 콘텐츠에 없는 파일은 삭제 대상
            const deletedEditorFiles = editorFileUrls.filter(file => !currentEditorUrls.includes(file.url));
            if (deletedEditorFiles.length > 0) {
                await Promise.all(deletedEditorFiles.map(file => deleteFile(file.fileId)));
                setEditorFileUrls(prev => prev.filter(file => currentEditorUrls.includes(file.url)));
            }

            // 임시 수정 API 호출 (수정 전 내용을 업데이트)
            await updateQna(no, title, modifiedContent);

            // 에디터 이미지 업로드 (신규 업로드 대상 처리)
            if (imageDataList.length > 0) {
                const editorFiles = imageDataList.map(item =>
                    base64ToFile(item.base64, item.originalFileName)
                );
                const editorTblTypes = editorFiles.map(() => TBL_TYPES.QNA_EDITOR);
                const editorTblIds = editorFiles.map(() => no);
                const uploadResult = await uploadFile(editorFiles, editorTblTypes, editorTblIds);
                imageDataList.forEach((item, idx) => {
                    const uploadedUrl = uploadResult[idx]?.url;
                    if (uploadedUrl) {
                        finalContent = finalContent.replace(item.placeholder, uploadedUrl);
                    }
                });

                await updateQna(no, title, modifiedContent);
            }

            // 첨부파일 업로드
            if (selectedFiles.length > 0) {
                const attachmentTblTypes = selectedFiles.map(() => TBL_TYPES.QNA_FILE);
                const attachmentTblIds = selectedFiles.map(() => no);
                await uploadFile(selectedFiles, attachmentTblTypes, attachmentTblIds);
            }

            await SingleButtonAlert("게시글이 수정되었습니다.");
            navigate("/parent/board");
        } catch (error) {
            console.error("수정 실패:", error);
            await SingleButtonAlert(error.response?.data?.message || "수정에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (title.trim() || text.trim()) {
            const result = await DoubleButtonAlert(
                "작성 중인 내용이 있습니다. 정말 취소하시겠습니까?",
                "예",
                "아니오"
            );
            if (result) {
                navigate("/counselor/board");
            }
        } else {
            navigate("/counselor/board");
        }
    };

    return (
        <div className="co-write-page">
            <Toast ref={toast} />
            <CounselorHeader />
            <div className="co-write-container">
                <label className="co-write-label">제목</label>
                <input
                    type="text"
                    className="co-write-input"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label className="co-write-label">내용</label>
                <Editor
                    value={text}
                    onTextChange={(e) => setText(e.htmlValue)}
                    style={{ height: "500px" }}
                />
                <div style={{ marginTop: "15px" }}>
                    <label className="co-write-label">첨부파일</label>
                    <div className="co-detail-file">
                        <label htmlFor="fileInput" className="co-detail-file-label">
                            파일 추가
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                const oversizedFiles = files.filter(file => file.size > 1000000);
                                if (oversizedFiles.length > 0) {
                                    toast.current.show({
                                        severity: 'warn',
                                        summary: '알림',
                                        detail: '1MB 이상의 파일은 업로드할 수 없습니다.',
                                        life: 3000
                                    });
                                    return;
                                }
                                setSelectedFiles(prev => [...prev, ...files]);
                            }}
                            accept="image/*,.pdf,.doc,.docx"
                            className="co-detail-file-input"
                        />
                        <div className="co-detail-selected-files">
                            {/* 기존 첨부파일 목록 */}
                            {attachmentFileUrls.map((file, index) => (
                                <div key={`existing-${index}`} className="co-detail-file-item">
                                    <span>{file.fileName}</span>
                                    <button
                                        onClick={() => handleFileDelete(file.fileId)}
                                        className="co-detail-file-remove"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {/* 새로 선택한 파일 목록 */}
                            {selectedFiles.map((file, index) => (
                                <div key={`new-${index}`} className="co-detail-file-item">
                                    <span>{file.name}</span>
                                    <button
                                        onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                                        className="co-detail-file-remove"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="co-write-buttons">
                    <button className="co-write-submit" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "수정 중..." : "수정"}
                    </button>
                    <button className="co-write-cancel" onClick={handleCancel}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default ParentBoardEditPage;
