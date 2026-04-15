import { create } from "zustand";
import type { ToastMessage } from "../types/railway";
import { generateId } from "../utils/formatters";

interface DashboardState {
  selectedProjectId: string | null;
  selectedServiceId: string | null;
  selectedEnvironmentId: string;
  sidebarCollapsed: boolean;
  logsAutoScroll: boolean;
  logsPaused: boolean;
  activeTab: "deployments" | "logs" | "variables" | "overview";
  toasts: ToastMessage[];
  selectProject: (id: string) => void;
  selectService: (id: string) => void;
  setEnvironment: (id: string) => void;
  toggleSidebar: () => void;
  toggleLogsAutoScroll: () => void;
  toggleLogsPaused: () => void;
  setActiveTab: (tab: "deployments" | "logs" | "variables" | "overview") => void;
  showToast: (type: "success" | "error" | "info", message: string) => void;
  dismissToast: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedProjectId: null,
  selectedServiceId: null,
  selectedEnvironmentId: "env-prod-001",
  sidebarCollapsed: false,
  logsAutoScroll: true,
  logsPaused: false,
  activeTab: "overview",
  toasts: [],

  selectProject: (id) => set({ selectedProjectId: id, selectedServiceId: null, activeTab: "overview" }),

  selectService: (id) => set({ selectedServiceId: id, activeTab: "overview" }),

  setEnvironment: (id) => set({ selectedEnvironmentId: id }),

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  toggleLogsAutoScroll: () => set((s) => ({ logsAutoScroll: !s.logsAutoScroll })),

  toggleLogsPaused: () => set((s) => ({ logsPaused: !s.logsPaused })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  showToast: (type, message) => {
    const id = generateId();
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
