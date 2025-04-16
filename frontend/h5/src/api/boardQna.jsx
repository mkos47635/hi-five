import api from "./api";

// ✅ QnA 작성 API 요청
export const createQna = async (title, content) => {
    try {
        console.log("📢 QnA 작성 요청:", { title, content });

        // 필수 입력값 검증
        if (!title || !content) {
            throw new Error("제목과 내용은 필수 입력값입니다.");
        }

        const response = await api.post("/qna/write", {
            title: title,
            content: content
        });

        console.log("✅ QnA 작성 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ QnA 작성 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ QnA 전체 조회 API 요청 
export const getQnaList = async (pageNumber = 0, pageSize = 10) => {
    try {
        console.log("📢 QnA 목록 조회 요청:", { pageNumber, pageSize });

        const response = await api.get("/qna/list", {
            params: {
                pageNumber,
                pageSize
            }
        });

        console.log("✅ QnA 목록 조회 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ QnA 목록 조회 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ QnA 검색(제목, 작성자) API 요청
export const searchQnas = async (keyword, searchType = 'title', pageNumber = 0, pageSize = 10) => {
    try {
        // 필수값 검증
        if (!keyword) {
            throw new Error("검색 키워드는 필수 입력값입니다.");
        }

        // 검색 타입 검증
        if (!['title', 'writer'].includes(searchType)) {
            throw new Error("검색 타입은 'title' 또는 'writer'만 가능합니다.");
        }

        console.log("📢 QnA 검색 요청:", { keyword, searchType, pageNumber, pageSize });

        // 검색 타입에 따른 URL 설정
        const searchUrl = searchType === 'title' 
            ? '/qna/search-by-title' 
            : '/qna/search-by-writer';

        const response = await api.get(searchUrl, {
            params: {
                keyword,
                pageNumber,
                pageSize
            }
        });

        console.log("✅ QnA 검색 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ QnA 검색 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ QnA 상세 조회 API 요청
export const getQnaDetail = async (qnaId) => {
    try {
        // 필수값 검증
        if (!qnaId) {
            throw new Error("QnA ID는 필수 입력값입니다.");
        }

        console.log("📢 QnA 상세 조회 요청:", { qnaId });

        const response = await api.get(`/qna/${qnaId}`);

        console.log("✅ QnA 상세 조회 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ QnA 상세 조회 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ QnA 수정 API 요청
export const updateQna = async (id, title, content) => {
    try {
        // 필수값 검증
        if (!id) {
            throw new Error("QnA ID는 필수 입력값입니다.");
        }
        if (!title) {
            throw new Error("제목은 필수 입력값입니다.");
        }
        if (!content) {
            throw new Error("내용은 필수 입력값입니다.");
        }

        console.log("📢 QnA 수정 요청:", { id, title, content });

        const response = await api.put(`/qna/update`, {
            id: id,
            title: title, 
            content: content
        });

        console.log("✅ QnA 수정 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ QnA 수정 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ QnA 삭제 API 요청
export const deleteQna = async (qnaId) => {
    try {
        // 필수값 검증
        if (!qnaId) {
            throw new Error("QnA ID는 필수 입력값입니다.");
        }

        console.log("📢 QnA 삭제 요청:", { qnaId });

        const response = await api.post(`/qna/delete/${qnaId}`, {
            params: {
                qnaId,
            }
        });

        console.log("✅ QnA 삭제 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ QnA 삭제 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ QnA 답글 작성 API 요청
export const createQnaAnswer = async (qnaId, content) => {
    try {
        // 필수값 검증
        if (!qnaId) {
            throw new Error("QnA ID는 필수 입력값입니다.");
        }
        if (!content) {
            throw new Error("답변 내용은 필수 입력값입니다.");
        }

        console.log("📢 QnA 답글 작성 요청:", { qnaId, content });

        const response = await api.post('/qna/write-qna-comment', {
            qnaId: qnaId,
            content: content,
        });

        console.log("✅ QnA 답글 작성 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ QnA 답글 작성 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ QnA 댓글 수정 API 요청
export const updateQnaComment = async (qnaCommentId, content) => {
    try {
        // 필수값 검증
        if (!qnaCommentId) {
            throw new Error("댓글 ID는 필수 입력값입니다.");
        }
        if (!content) {
            throw new Error("수정할 내용은 필수 입력값입니다.");
        }

        console.log("📢 QnA 댓글 수정 요청:", { qnaCommentId, content });

        const response = await api.put('/qna/update-comment', {
            qnaCommentId: qnaCommentId,
            content: content,
        });

        console.log("✅ QnA 댓글 수정 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ QnA 댓글 수정 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ QnA 댓글 삭제 API 요청
export const deleteQnaComment = async (qnaCommentId) => {
    try {
        // 필수값 검증
        if (!qnaCommentId) {
            throw new Error("댓글 ID는 필수 입력값입니다.");
        }

        console.log("📢 QnA 댓글 삭제 요청:", { qnaCommentId });

        const response = await api.put(`/qna/delete-comment/${qnaCommentId}`
        //     , {
        //     params: {
        //         qnaCommentId,
        //     }
        // }
    );

        console.log("✅ QnA 댓글 삭제 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ QnA 댓글 삭제 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};



