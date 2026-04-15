import { useEffect } from "react";
import { useProjects } from "../hooks/useRailway";
import { useDashboardStore } from "../stores/dashboardStore";
import { Sidebar } from "./layout/Sidebar";
import { MainContent } from "./layout/MainContent";
import { ToastContainer } from "./common/ToastContainer";

export function Dashboard() {
  const { data: projects, isLoading } = useProjects();
  const { selectedProjectId, selectedServiceId, selectProject, selectService, sidebarCollapsed } =
    useDashboardStore();

  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      selectProject(projects[0].id);
      if (projects[0].services.length > 0) {
        selectService(projects[0].services[0].id);
      }
    }
  }, [projects, selectedProjectId, selectProject, selectService]);

  const currentProject = projects?.find((p) => p.id === selectedProjectId);
  const currentService = currentProject?.services.find((s) => s.id === selectedServiceId);

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar projects={projects || []} loading={isLoading} />
      <MainContent
        project={currentProject || null}
        service={currentService || null}
        loading={isLoading}
      />
      <ToastContainer />
    </div>
  );
}
