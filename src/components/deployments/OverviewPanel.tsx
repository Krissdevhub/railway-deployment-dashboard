import type { Service, Project, Deployment } from "../../types/railway";
import { DeploymentStatus } from "../../types/railway";
import { formatRelativeTime, formatFullDate } from "../../utils/formatters";
import { useDashboardStore } from "../../stores/dashboardStore";
import { InfrastructureMap } from "../visualization/InfrastructureMap";

interface OverviewPanelProps {
  service: Service;
  project: Project;
  deployments: Deployment[];
  latestDeployment: Deployment | null;
}

export function OverviewPanel({
  service,
  project,
  deployments,
  latestDeployment,
}: OverviewPanelProps) {
  const selectService = useDashboardStore((s) => s.selectService);

  const successCount = deployments.filter(
    (d) => d.status === DeploymentStatus.SUCCESS
  ).length;
  const failedCount = deployments.filter(
    (d) => d.status === DeploymentStatus.FAILED || d.status === DeploymentStatus.CRASHED
  ).length;

  return (
    <div>
      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-label">Status</div>
          <div className="stat-value">
            <span
              className={`status-badge ${
                latestDeployment?.status === DeploymentStatus.SUCCESS
                  ? "running"
                  : latestDeployment?.status?.toLowerCase() || "stopped"
              }`}
              style={{ fontSize: 14 }}
            >
              <span className="status-dot" />
              {latestDeployment?.status
                ? latestDeployment.status.charAt(0) +
                  latestDeployment.status.slice(1).toLowerCase()
                : "No deploys"}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Last Deployed</div>
          <div className="stat-value" style={{ fontSize: 16 }}>
            {latestDeployment
              ? formatRelativeTime(latestDeployment.updatedAt)
              : "Never"}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Successful Deploys</div>
          <div className="stat-value" style={{ color: "var(--status-running)" }}>
            {successCount}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Failed Deploys</div>
          <div className="stat-value" style={{ color: failedCount > 0 ? "var(--status-failed)" : "var(--text-tertiary)" }}>
            {failedCount}
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-header">
          <span className="panel-title">Service Details</span>
        </div>
        <div className="panel-body">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Service ID", service.id],
                ["Project", project.name],
                ["Branch", latestDeployment?.branch || "main"],
                ["Environment", "production"],
                ["Created", formatFullDate(service.createdAt)],
                ["Last Updated", formatRelativeTime(service.updatedAt)],
                [
                  "Latest Commit",
                  latestDeployment?.commitMessage || "N/A",
                ],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "var(--text-tertiary)",
                      fontSize: 13,
                      width: 140,
                      verticalAlign: "top",
                    }}
                  >
                    {label}
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color:
                        label === "Service ID"
                          ? "var(--text-tertiary)"
                          : "var(--text-primary)",
                      fontSize: label === "Service ID" ? 12 : 13,
                    }}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Infrastructure</span>
        </div>
        <InfrastructureMap
          services={project.services}
          selectedServiceId={service.id}
          onSelectService={selectService}
        />
      </div>
    </div>
  );
}
