import type { Service } from "../../types/railway";
import { DeploymentStatus } from "../../types/railway";

interface InfrastructureMapProps {
  services: Service[];
  selectedServiceId: string;
  onSelectService: (id: string) => void;
}

function getStatusClass(status?: DeploymentStatus): string {
  if (!status) return "stopped";
  switch (status) {
    case DeploymentStatus.SUCCESS: return "running";
    case DeploymentStatus.BUILDING:
    case DeploymentStatus.DEPLOYING: return "deploying";
    case DeploymentStatus.FAILED:
    case DeploymentStatus.CRASHED: return "failed";
    case DeploymentStatus.SLEEPING: return "sleeping";
    default: return "stopped";
  }
}

function getStatusColor(status?: DeploymentStatus): string {
  if (!status) return "var(--status-stopped)";
  switch (status) {
    case DeploymentStatus.SUCCESS: return "var(--status-running)";
    case DeploymentStatus.BUILDING:
    case DeploymentStatus.DEPLOYING: return "var(--status-deploying)";
    case DeploymentStatus.FAILED:
    case DeploymentStatus.CRASHED: return "var(--status-failed)";
    case DeploymentStatus.SLEEPING: return "var(--status-sleeping)";
    default: return "var(--status-stopped)";
  }
}

export function InfrastructureMap({
  services,
  selectedServiceId,
  onSelectService,
}: InfrastructureMapProps) {
  return (
    <div className="infra-map">
      {services.map((service) => {
        const status = service.latestDeployment?.status;
        const statusClass = getStatusClass(status);
        const statusColor = getStatusColor(status);
        const isSelected = service.id === selectedServiceId;

        return (
          <div
            key={service.id}
            className={`infra-node ${isSelected ? "active" : ""}`}
            onClick={() => onSelectService(service.id)}
          >
            <div className="infra-node-icon">{service.icon}</div>
            <div className="infra-node-name">{service.name}</div>
            <span
              className={`status-badge ${statusClass}`}
              style={{ fontSize: 11 }}
            >
              <span className="status-dot" />
              {status
                ? status.charAt(0) + status.slice(1).toLowerCase()
                : "Inactive"}
            </span>
            <div
              style={{
                width: "100%",
                height: 2,
                background: statusColor,
                borderRadius: 1,
                marginTop: 10,
                opacity: 0.6,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
