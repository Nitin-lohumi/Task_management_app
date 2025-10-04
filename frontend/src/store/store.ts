import { create } from "zustand";
interface User {
  id: string;
  name: string;
  email?: string;
}
interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User) => void;
  logoutUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) =>
    set({
      user,
      loading: false,
    }),
  logoutUser: () =>
    set({
      user: null,
      loading: false,
    }),
}));
