import { create } from 'zustand';

export const useUserStore = create((set) => ({
  userName: "",
  childData: { 
    childUserId: null, 
    childUserName: "" 
  },
  role: "",

  setUserName: (name) => set({ userName: name }),
  setUserRole: (role) => set({ role }),
  setChildData: (id, name) => set({ childData: { childUserId: id, childUserName: name } }),
}));
