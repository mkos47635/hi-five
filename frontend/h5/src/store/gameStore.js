// useGameStore.js
import { create } from "zustand";
import { reviewGame } from "../api/childGameContent";

const useGameStore = create((set, get) => ({
  chapterData: {},
  currentChapter: null,
  currentStageIndex: 0,
  
  // 지정된 챕터의 모든 스테이지 데이터를 가져옴
  fetchChapterData: async (chapterId) => {
    try {
      // 5개의 스테이지 데이터를 한 번에 가져옴
      const stagePromises = Array.from({ length: 5 }, (_, i) =>
        reviewGame(chapterId, i + 1)
      );

      const stageResults = await Promise.all(stagePromises);
      const chapterData = stageResults
        .map((res) => (res ? { ...res} : null))
        .filter(Boolean);

      // 기존 데이터를 병합하여 상태 업데이트
      set({
        chapterData: { ...get().chapterData, [chapterId]: chapterData },
        currentChapter: chapterId,
        currentStageIndex: 0,
      });

      return chapterData;
    } catch (error) {
      console.error(`❌: 챕터 ${chapterId} 데이터 가져오기 실패:`, error);
      return null;
    }
  },

  // 현재 챕터와 스테이지 인덱스를 기반으로 데이터 반환
  getCurrentGameData: () => {
    const { chapterData, currentChapter, currentStageIndex } = get();
    console.log("chapterData: ", chapterData);
    console.log("currentChapter: ", currentChapter);
    console.log("currentStageIndex: ", currentStageIndex);
    return chapterData[currentChapter]?.[currentStageIndex] || null;
  },

  // 스테이지를 증가시키는 함수
  incrementStage: () =>
    set((state) => {
      const nextStageIndex = state.currentStageIndex + 1;
      console.log("새로운 스테이지 인덱스:", nextStageIndex);
      return { currentStageIndex: nextStageIndex };
    }),

  // 해당 스테이지와 챕터에 대한 정보
  setChapterAndStage: (chapterId, gameStageId) =>
    set({
      currentChapter: chapterId,
      currentStageIndex: gameStageId - 1,
    }),

  // 챕터 변경 시 현재 챕터와 스테이지 인덱스를 초기화
  setCurrentChapter: (chapterId) =>
    set({ currentChapter: chapterId, currentStageIndex: 0 }),

  // 챕터 선택 시 데이터를 불러옴
  selectChapter: (chapterId) => {
    set({ currentChapter: chapterId, currentStageIndex: 0 });
    get().fetchChapterData(chapterId);
  },
}));


export default useGameStore;
