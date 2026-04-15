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

  selectProject: (id: string) => set({ selectedProjectId: id, selectedServiceId: null, activeTab: "overview" }),

  selectService: (id: string) => set({ selectedServiceId: id, activeTab: "overview" }),

  setEnvironment: (id: string) => set({ selectedEnvironmentId: id }),

  toggleSidebar: () => set((s: DashboardState) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  toggleLogsAutoScroll: () => set((s: DashboardState) => ({ logsAutoScroll: !s.logsAutoScroll })),

  toggleLogsPaused: () => set((s: DashboardState) => ({ logsPaused: !s.logsPaused })),

  setActiveTab: (tab: "deployments" | "logs" | "variables" | "overview") => set({ activeTab: tab }),

  showToast: (type: "success" | "error" | "info", message: string) => {
    const id = generateId();
    set((s: DashboardState) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((s: DashboardState) => ({ toasts: s.toasts.filter((t: any) => t.id !== id) }));
    }, 4000);
  },

  dismissToast: (id: string) => set((s: DashboardState) => ({ toasts: s.toasts.filter((t: any) => t.id !== id) })),
}));
