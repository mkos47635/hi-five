import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChildIdstore = create(
  persist((set) => ({
    childId: null,
    childName: "",

    setChildId: (childId) => {
      set({ childId: childId });
      sessionStorage.setItem("childId", childId);
    },

    setChildName: (childName) => {
      set({ childName: childName });
      sessionStorage.setItem("childName", childName);
    },

    clearChildInfo: () => {
      set({ childId: null, childName: "" });
      sessionStorage.removeItem("childId");
      sessionStorage.removeItem("childName");
    },
  }))
);

export default useChildIdstore;
