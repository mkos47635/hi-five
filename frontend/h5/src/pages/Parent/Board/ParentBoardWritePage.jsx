import { useState, useRef } from "react";
import { Editor } from "primereact/editor";
import { FileUpload } from 'primereact/fileupload';
import { useNavigate } from 'react-router-dom';
import {base64ToFile, useBoardStore} from "../../../store/boardStore";
import ParentHeader from "/src/components/Parent/ParentHeader";
import DoubleButtonAlert from "../../../components/common/DoubleButtonAlert";
import SingleButtonAlert from "/src/components/common/SingleButtonAlert";
import {createQna, updateQna} from "../../../api/boardQna";
import { uploadFile, TBL_TYPES } from "../../../api/file";
import "/src/pages/Parent/ParentCss/ParentBoardWritePage.css";
import { extractAndReplaceEditorImages } from "../../../store/boardStore";
import {createNotice} from "../../../api/boardNotice.jsx";

"/src/store/boardStore.js"

function ParentBoardWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 
  const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 파일들을 저장할 state 추가
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const setPaActiveTab = useBoardStore(state => state.setPaActiveTab);

  const showToast = (severity, summary, detail) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000
    });
  };

  const validateForm = () => {
    if (!title.trim()) {
      showToast('warn', '알림', '제목을 입력해주세요.');
      return false;
    }
    if (!content.trim()) {
      showToast('warn', '알림', '내용을 입력해주세요.');
      return false;
    }
    return true;
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    const files = event.files;
    // 파일 크기 검증
    const oversizedFiles = files.filter(file => file.size > 1000000);
    
    if (oversizedFiles.length > 0) {
      showToast('warn', '알림', '100MB 이상의 파일은 업로드할 수 없습니다.');
      return;
    }
    
    setSelectedFiles(files);
  };

  // 파일 업로드 부분 수정
  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      if (isSubmitting) return;
      setIsSubmitting(true);

      const { modifiedContent, imageDataList } = extractAndReplaceEditorImages(content);

      // 1. 게시글 생성
      const qnaResponse = await createQna(title, modifiedContent);
      const qnaId = qnaResponse.qnaId || qnaResponse.data?.qnaId;

      let finalContent = modifiedContent;

      // 2. 웹 에디터 이미지 업로드
      if (imageDataList.length > 0) {
        // imageDataList의 각 항목을 File 객체로 변환
        const editorFiles = imageDataList.map(item =>
            base64ToFile(item.base64, item.originalFileName)
        );
        console.log(editorFiles);
        const editorTblTypes = editorFiles.map(() => TBL_TYPES.QNA_EDITOR);
        console.log(editorTblTypes)
        const editorTblIds = editorFiles.map(() => qnaId);

        const editorUploadResponse = await uploadFile(editorFiles, editorTblTypes, editorTblIds);

        imageDataList.forEach((item, idx) => {
          const uploadedUrl = editorUploadResponse[idx]?.url;
          if (uploadedUrl) {
            finalContent = finalContent.replace(item.placeholder, uploadedUrl);
          }
        });
        await updateQna(qnaId, title, finalContent);
      }

      // 3. 파일 업로드 (첨부파일)
      if (qnaId && selectedFiles.length > 0) {
        const attachmentTblTypes = selectedFiles.map(() => TBL_TYPES.QNA_FILE);
        const attachmentTblIds = selectedFiles.map(() => qnaId);
        await uploadFile(selectedFiles, attachmentTblTypes, attachmentTblIds);
      }

      await SingleButtonAlert('질문이 등록되었습니다.');
      setPaActiveTab("qna");
      navigate('/parent/board');

    } catch (error) {
      console.error("게시글 등록 실패:", error);
      await SingleButtonAlert('질문 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = async () => {
    if (title.trim() || content.trim()) {
      // DoubleButtonAlert로 확인
      const result = await DoubleButtonAlert(
        '작성 중인 내용이 있습니다. 정말 취소하시겠습니까?',
        '예',
        '아니오'
      );

      if (result) {
        setPaActiveTab("qna");
        navigate('/parent/board');
      }
    } else {
      setPaActiveTab("qna");
      navigate('/parent/board');
    }
  };

  return (
    <div className="pa-write-page">
      <ParentHeader />

      <div className="pa-write-container">
        <label className="pa-write-label">제목</label>
        <input
          type="text"
          className="pa-write-input"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="pa-write-label">내용</label>
        <Editor
          value={content}
          onTextChange={(e) => setContent(e.htmlValue)}
          style={{ height: "500px" }}
        />

        {/* Editor와 FileUpload 사이에 10px 공간 추가 */}
        <div style={{ marginTop: "15px" }}>
          <label className="pa-write-label">첨부파일</label>
          <FileUpload 
            name="files" 
            customUpload={true} 
            onSelect={handleFileSelect}
            multiple 
            maxFileSize={1000000}
            accept="image/*,.pdf,.doc,.docx"
            emptyTemplate={<p className="m-0">파일을 드래그하거나 선택하여 업로드하세요. (최대 1MB)</p>} 
            auto={false}
            // showUploadButton={false}  // Upload 버튼 숨기기
            // showButtons={false} 
          />
        </div>

        <div className="pa-write-buttons">
          <button 
            className="pa-write-submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
          <button className="pa-write-cancel" onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParentBoardWritePage;
