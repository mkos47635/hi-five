import api from "./api";

// ✅ FAQ 글 작성 API 요청
export const createFaq = async (title, type, faqAnswer) => {
    try {
        console.log("📢 FAQ 작성 요청:", { title, faqAnswer, type });

        // 필수 입력값 검증 (API 명세서의 Required 필드와 일치)
        if (!title || !faqAnswer || !type) {
            throw new Error("제목과 답변은 필수 입력값입니다.");
        }

        const response = await api.post("/faq/write", {
            title,
            type,
            faqAnswer
        });

        console.log("✅ FAQ 작성 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ FAQ 작성 실패:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ FAQ 전체 글 조회 API 요청 (페이징 처리 포함)
export const getFaqList = async (pageNumber = 0, pageSize = 10) => {
    try {
        console.log("📢 FAQ 전체 글 조회 요청:", { pageNumber, pageSize });

        const response = await api.get("/faq/list", {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        });

        console.log("✅ FAQ 전체 글 조회 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ FAQ 전체 글 조회 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ FAQ 검색(제목, 작성자) API 요청
export const searchFaqs = async (keyword, searchType = 'title', pageNumber = 0, pageSize = 10) => {
    try {
        // 필수값 검증
        if (!keyword) {
            throw new Error("검색 키워드는 필수 입력값입니다.");
        }

        // 검색 타입 검증
        if (!['title', 'writer'].includes(searchType)) {
            throw new Error("검색 타입은 'title' 또는 'writer'만 가능합니다.");
        }

        console.log("📢 FAQ 검색 요청", { keyword, searchType, pageNumber, pageSize });

        // 검색 타입에 따른 URL 설정
        const searchUrl = searchType === 'title' 
            ? '/faq/search-by-title' 
            : '/faq/search-by-writer';

        const response = await api.get(searchUrl, {
            params: {
                keyword,
                pageNumber,
                pageSize
            }
        });
        console.log("응답 맞음?" , response.data);
        

        console.log("✅ FAQ 검색 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ FAQ 검색 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ FAQ 상세 조회 API 요청
export const getFaqDetail = async (faqId) => {
    try {
        // 필수값 검증
        if (!faqId) {
            throw new Error("FAQ ID는 필수 입력값입니다.");
        }

        console.log("📢 FAQ 상세 조회 요청:", { faqId });

        const response = await api.get(`/faq/${faqId}`);

        console.log("✅ FAQ 상세 조회 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ FAQ 상세 조회 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ FAQ 수정 API 요청
export const updateFaq = async (id, title, type, answer) => {
    try {
        // 필수값 검증
        if (!id) {
            throw new Error("FAQ ID는 필수 입력값입니다.");
        }
        if (!title) {
            throw new Error("제목은 필수 입력값입니다.");
        }
        if (!type) {
            throw new Error("타입은 필수 입력값입니다.");
        }
        if (!answer) {
            throw new Error("답변은 필수 입력값입니다.");
        }

        console.log("📢 FAQ 수정 요청:", { id, title, type, answer });

        const response = await api.put(`/faq/update`, {
            faqId: id,
            faqTitle: title, 
            type: type,
            faqAnswer: answer
        });

        console.log("✅ FAQ 수정 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ FAQ 수정 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ FAQ 삭제 API 요청
export const deleteFaq = async (faqId) => {
    try {
        // 필수값 검증
        if (!faqId) {
            throw new Error("FAQ ID는 필수 입력값입니다.");
        }

        console.log("📢 FAQ 삭제 요청:", { faqId });

        const response = await api.post(`/faq/delete/${faqId}`);

        console.log("✅ FAQ 삭제 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ FAQ 삭제 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};