import api from "./api";

// ✅ 공지사항 작성 API 요청
export const createNotice = async (title, content) => {
    try {
        console.log("📢 공지사항 작성 요청:", { title, content });

        // title과 content가 비어있는지 검증
        if (!title || !content) {
            throw new Error("제목과 내용은 필수 입력값입니다.");
        }

        const response = await api.post("/notice/write", {
            title: title,
            content: content,
        });

        console.log("✅ 공지사항 작성 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ 공지사항 작성 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 전체 글 조회 API 요청 (페이징 처리 포함)
export const getNoticePosts = async (pageNumber = 0, pageSize = 10) => {
    try {
        console.log("📢 전체 글 조회 요청:", { pageNumber, pageSize });

        const response = await api.get("/notice/list", {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });

        console.log("✅ 전체 글 조회 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ 전체 글 조회 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 공지사항 검색(제목, 작성자) API 요청
export const searchNotices = async (keyword, searchType = 'title', pageNumber = 0, pageSize = 10) => {
    try {
        // 필수값 검증
        if (!keyword) {
            throw new Error("검색 키워드는 필수 입력값입니다.");
        }

        // 검색 타입 검증
        if (!['title', 'writer'].includes(searchType)) {
            throw new Error("검색 타입은 'title' 또는 'writer'만 가능합니다.");
        }

        console.log("📢 공지사항 검색 요청");

        // 검색 타입에 따른 URL 설정
        const searchUrl = searchType === 'title' 
            ? '/notice/search-by-title' 
            : '/notice/search-by-writer';

        const response = await api.get(searchUrl, {
            params: {
                keyword,
                pageNumber,
                pageSize
            }
        });

        console.log("✅ 공지사항 검색 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ 공지사항 검색 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 공지사항 상세 조회 API 요청
export const getNoticeDetail = async (noticeId) => {
    try {
        // 필수값 검증
        if (!noticeId) {
            throw new Error("공지사항 ID는 필수 입력값입니다.");
        }

        console.log("📢 공지사항 상세 조회 요청:", { noticeId });

        const response = await api.get(`/notice/${noticeId}`);

        console.log("✅ 공지사항 상세 조회 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ 공지사항 상세 조회 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 공지사항 수정 API 요청
export const updateNotice = async (id, title, content) => {
    try {
        // 필수값 검증
        if (!id) {
            throw new Error("공지사항 ID는 필수 입력값입니다.");
        }
        if (!title) {
            throw new Error("제목은 필수 입력값입니다.");
        }
        if (!content) {
            throw new Error("내용은 필수 입력값입니다.");
        }

        console.log("📢 공지사항 수정 요청:", { id, title, content });

        const response = await api.put(`/notice/update`, {
            id: id,
            title: title,
            content: content
        });

        console.log("✅ 공지사항 수정 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ 공지사항 수정 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 공지사항 삭제 API 요청
export const deleteNotice = async (noticeId) => {
    try {
        // 필수값 검증
        if (!noticeId) {
            throw new Error("공지사항 ID는 필수 입력값입니다.");
        }

        console.log("📢 공지사항 삭제 요청:", { noticeId });

        const response = await api.post(`/notice/delete/${noticeId}`);

        console.log("✅ 공지사항 삭제 성공");
        return response.data;

    } catch (error) {
        console.error("❌ 공지사항 삭제 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

