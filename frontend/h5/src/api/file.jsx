import api from "./api";

export const TBL_TYPES = {
    PROFILE_CHILD: 'PCD',
    PROFILE_CONSULTANT: 'PCT',
    NOTICE_EDITOR: 'NE',
    NOTICE_FILE: 'NF',
    QNA_EDITOR: 'QE',
    QNA_FILE: 'QF',
    GAME: 'G',
    FAQ_EDITOR: 'FE',
    FAQ_FILE: 'FF'
};

export const uploadFile = async (files, tblTypes, tblIds) => {
    try {
        // 파라미터 유효성 검사
        if (!files || !Array.isArray(files) || files.length === 0) {
            throw new Error('파일 배열이 필요합니다.');
        }
        if (!tblTypes || !Array.isArray(tblTypes) || tblTypes.length !== files.length) {
            throw new Error('tblTypes는 파일 배열과 동일한 길이의 배열이어야 합니다.');
        }
        if (!tblIds || !Array.isArray(tblIds) || tblIds.length !== files.length) {
            throw new Error('tblIds는 파일 배열과 동일한 길이의 배열이어야 합니다.');
        }
        // 각 tblType 유효성 검사
        tblTypes.forEach((tblType, index) => {
            if (!Object.values(TBL_TYPES).includes(tblType)) {
                throw new Error(
                    `유효하지 않은 tblType[${index}]: ${tblType}. 유효한 타입: ${Object.values(TBL_TYPES).join(', ')}`
                );
            }
        });

        const formData = new FormData();
        // 파일 배열을 순회하며 FormData에 파일 추가 (키 이름은 백엔드에서 처리하는 대로 "files"로 지정)
        files.forEach(file => {
            formData.append('file', file);
            console.log("file:####", file);
        });

        // metaData는 tblType, tblId 배열을 JSON 문자열로 변환하여 전송
        const metaData = JSON.stringify({ tblType: tblTypes, tblId: tblIds });
        console.log([metaData])
        formData.append('metaData', new Blob([metaData], { type: 'application/json' }));

        formData.forEach(data => {
            console.log("formData:",data);
        })

        const response = await api.post("/file/upload", formData, {
            headers: {
                "Content-Type" : "multipart/form-data"
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ 파일 업로드 실패:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
        });
        throw error;
    }
};



// ✅ 파일 URL 조회 API 요청
export const getFileUrl = async (tblType, tblId) => {
    try {
        // 필수값 검증
        if (!tblType) {
            throw new Error("테이블 타입은 필수 입력값입니다.");
        }
        if (!tblId) {
            throw new Error("테이블 ID는 필수 입력값입니다.");
        }
        
        console.log("📢 파일 URL 조회 요청:", { tblType, tblId });
        
        const response = await api.get(`/file/urls/${tblType}/${tblId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log("✅ 파일 URL 조회 성공:", response.data);
        return response.data;
        
    } catch (error) {
        console.error("❌ 파일 URL 조회 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};


// ✅ 파일 다운로드 API 요청
export const downloadFile = async (fileId, fileName) => {
    try {
        if (!fileId) {
            throw new Error("파일 ID는 필수 입력값입니다.");
        }

        console.log("📢 파일 다운로드 요청:", { fileId });

        const response = await api.get(`/file/download/${fileId}`, {
            params: { fileId },
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { 
            type: response.headers['content-type'] || 'application/octet-stream'
        });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // 전달받은 원본 파일명 사용
        a.download = fileName;
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log("✅ 파일 다운로드 성공");
        return response.data;

    } catch (error) {
        console.error("❌ 파일 다운로드 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// ✅ 파일 삭제 API 요청
export const deleteFile = async (fileId) => {
    try {
        // 필수값 검증
        if (!fileId) {
            throw new Error("파일 ID는 필수 입력값입니다.");
        }

        console.log("📢 파일 삭제 요청:", { fileId });

        const response = await api.delete(`/file/${fileId}`);

        console.log("✅ 파일 삭제 성공:", response.data);
        return response.data;

    } catch (error) {
        console.error("❌ 파일 삭제 실패:", error.response ? error.response.data : error.message);
        throw error;
    }
};