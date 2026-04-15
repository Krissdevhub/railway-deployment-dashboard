import { Train, PanelLeftClose, PanelLeft } from "lucide-react";
import type { Project } from "../../types/railway";
import { DeploymentStatus } from "../../types/railway";
import { useDashboardStore } from "../../stores/dashboardStore";

interface SidebarProps {
  projects: Project[];
  loading: boolean;
}

function getStatusClass(status?: DeploymentStatus): string {
  if (!status) return "stopped";
  switch (status) {
    case DeploymentStatus.SUCCESS:
      return "running";
    case DeploymentStatus.BUILDING:
      return "building";
    case DeploymentStatus.DEPLOYING:
    case DeploymentStatus.QUEUED:
    case DeploymentStatus.WAITING:
      return "deploying";
    case DeploymentStatus.FAILED:
    case DeploymentStatus.CRASHED:
      return "failed";
    case DeploymentStatus.SLEEPING:
    case DeploymentStatus.REMOVED:
      return "sleeping";
    default:
      return "stopped";
  }
}

export function Sidebar({ projects, loading }: SidebarProps) {
  const {
    selectedServiceId,
    selectProject,
    selectService,
    sidebarCollapsed,
    toggleSidebar,
  } = useDashboardStore();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Train size={16} />
        </div>
        <span className="sidebar-title">Railway Dashboard</span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={toggleSidebar}
          style={{ marginLeft: "auto", padding: "4px" }}
        >
          {sidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <div className="sidebar-content">
        {loading && (
          <div style={{ padding: "8px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton skeleton-card" style={{ height: 36, marginBottom: 4 }} />
            ))}
          </div>
        )}

        {!loading &&
          projects.map((project) => (
            <div key={project.id} className="sidebar-section">
              <div
                className="sidebar-section-label"
                style={{ cursor: "pointer" }}
                onClick={() => selectProject(project.id)}
              >
                {project.name}
              </div>

              {project.services.map((service) => (
                <div
                  key={service.id}
                  className={`service-item ${
                    selectedServiceId === service.id ? "active" : ""
                  }`}
                  onClick={() => {
                    selectProject(project.id);
                    selectService(service.id);
                  }}
                >
                  <span className="service-item-icon">{service.icon}</span>
                  <span className="service-item-name">{service.name}</span>
                  <div
                    className={`service-item-status ${getStatusClass(
                      service.latestDeployment?.status
                    )}`}
                  />
                </div>
              ))}
            </div>
          ))}
      </div>

      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border-primary)",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        {sidebarCollapsed ? "" : "Demo Mode"}
      </div>
    </aside>
  );
}
