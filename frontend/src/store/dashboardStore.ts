import { create } from "zustand";
import type { DashboardStats } from "../types";
import api from "../services/api";

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/admin/dashboard/stats");
      set({ stats: response.data, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch dashboard stats:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to fetch dashboard stats";
      set({ error: errorMessage, loading: false });
    }
  },

  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
