import type { Deployment } from "../../types/railway";
import { DeploymentStatus } from "../../types/railway";
import { formatRelativeTime, truncateHash } from "../../utils/formatters";
import { GitBranch } from "lucide-react";

interface DeploymentHistoryProps {
  deployments: Deployment[];
  loading: boolean;
}

function getStatusBadgeClass(status: DeploymentStatus): string {
  switch (status) {
    case DeploymentStatus.SUCCESS: return "success";
    case DeploymentStatus.BUILDING: return "building";
    case DeploymentStatus.DEPLOYING: return "deploying";
    case DeploymentStatus.FAILED: return "failed";
    case DeploymentStatus.CRASHED: return "crashed";
    case DeploymentStatus.SLEEPING: return "sleeping";
    case DeploymentStatus.QUEUED: return "queued";
    case DeploymentStatus.WAITING: return "waiting";
    default: return "stopped";
  }
}

export function DeploymentHistory({ deployments, loading }: DeploymentHistoryProps) {
  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Deployment History</span>
        </div>
        <div style={{ padding: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
          ))}
        </div>
      </div>
    );
  }

  if (deployments.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Deployment History</span>
        </div>
        <div className="empty-state" style={{ padding: 40 }}>
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-title">No deployments yet</div>
          <div className="empty-state-desc">
            Click Deploy to create your first deployment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Deployment History</span>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          {deployments.length} deployments
        </span>
      </div>
      <div>
        {deployments.map((deployment, index) => (
          <div
            key={deployment.id}
            className="deploy-history-item"
            style={{ animationDelay: `${index * 50}ms`, animation: "slide-up 0.3s ease forwards" }}
          >
            <span
              className={`status-badge ${getStatusBadgeClass(deployment.status)}`}
              style={{ minWidth: 95, justifyContent: "center" }}
            >
              <span className="status-dot" />
              {deployment.status.charAt(0) + deployment.status.slice(1).toLowerCase()}
            </span>

            <div className="deploy-info">
              <div className="deploy-message">
                {deployment.commitMessage || "Manual deployment"}
              </div>
              <div className="deploy-meta">
                {deployment.commitHash && (
                  <span className="deploy-hash">
                    {truncateHash(deployment.commitHash)}
                  </span>
                )}
                {deployment.branch && (
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <GitBranch size={11} />
                    {deployment.branch}
                  </span>
                )}
                <span>{formatRelativeTime(deployment.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
