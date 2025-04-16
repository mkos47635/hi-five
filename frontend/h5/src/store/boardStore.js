import { create } from 'zustand';

export const useBoardStore = create((set) => ({
  paActiveTab: "notice", // 초기값을 notice로 설정
  setPaActiveTab: (tab) => set({ paActiveTab: tab }),
}));

export function extractAndReplaceEditorImages(htmlContent, startIndex = 0) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const imgTags = doc.querySelectorAll("img");
  const imageDataList = [];
  let index = startIndex; // 시작 인덱스를 사용
  imgTags.forEach((img) => {
    const src = img.getAttribute("src");
    if (src && src.startsWith("data:image/")) {
      const originalFileName = img.getAttribute("data-filename") || `editor_image_${index}.png`;
      const placeholder = `__EDITOR_IMAGE_PLACEHOLDER_${index}__`;
      imageDataList.push({
        placeholder,
        base64: src,
        originalFileName,
      });
      img.setAttribute("src", placeholder);
      index++;
    }
  });
  return { modifiedContent: doc.body.innerHTML, imageDataList };
}


export const base64ToFile = (base64, filename) => {
  // base64 데이터와 MIME 타입 분리
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1]; // 예: image/png
  const bstr = atob(arr[1]); // Base64 디코딩
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  // 각 문자 코드 값을 Uint8Array에 저장
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // File 객체 생성 (마지막 인자로 파일의 MIME 타입 지정)
  return new File([u8arr], filename, { type: mime });
};

export const replaceEditorPlaceholders = (htmlContent, editorFileUrls) => {
  let updatedContent = htmlContent;
  // editorFileUrls 배열의 인덱스와 매칭되는 placeholder 형식: __EDITOR_IMAGE_PLACEHOLDER_0__, __EDITOR_IMAGE_PLACEHOLDER_1__, ...
  editorFileUrls.forEach((file, index) => {
    const placeholder = `__EDITOR_IMAGE_PLACEHOLDER_${index}__`;
    // 모든 placeholder를 실제 파일 URL로 대체 (정규식을 이용하여 global 교체)
    updatedContent = updatedContent.replace(new RegExp(placeholder, 'g'), file.url);
  });
  return updatedContent;
};