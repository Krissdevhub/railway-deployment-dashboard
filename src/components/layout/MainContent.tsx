import {
  Rocket,
  Square,
  RotateCcw,
  Activity,
  ScrollText,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import type { Project, Service } from "../../types/railway";
import { DeploymentStatus } from "../../types/railway";
import { useDashboardStore } from "../../stores/dashboardStore";
import { useDeployAction, useDeployments } from "../../hooks/useRailway";
import { OverviewPanel } from "../deployments/OverviewPanel";
import { DeploymentHistory } from "../deployments/DeploymentHistory";
import { LogsViewer } from "../logs/LogsViewer";
import { EnvironmentVariables } from "../variables/EnvironmentVariables";

interface MainContentProps {
  project: Project | null;
  service: Service | null;
  loading: boolean;
}

export function MainContent({ project, service, loading }: MainContentProps) {
  const { activeTab, setActiveTab, selectedEnvironmentId } = useDashboardStore();
  const { deployMutation, stopMutation, restartMutation } = useDeployAction();
  const { data: deployments } = useDeployments(service?.id || null);

  const latestDeployment = service?.latestDeployment || deployments?.[0];
  const isDeploying =
    latestDeployment?.status === DeploymentStatus.BUILDING ||
    latestDeployment?.status === DeploymentStatus.DEPLOYING;
  const isRunning = latestDeployment?.status === DeploymentStatus.SUCCESS;

  function handleDeploy() {
    if (!service) return;
    deployMutation.mutate({
      serviceId: service.id,
      environmentId: selectedEnvironmentId,
    });
  }

  function handleStop() {
    if (!latestDeployment) return;
    stopMutation.mutate(latestDeployment.id);
  }

  function handleRestart() {
    if (!latestDeployment) return;
    restartMutation.mutate(latestDeployment.id);
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="main-header">
          <div className="skeleton skeleton-text medium" style={{ width: 200 }} />
        </div>
        <div className="main-body">
          <div className="overview-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 80 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="main-content">
        <div className="main-header">
          <div className="header-left">
            <span className="header-service-name" style={{ color: "var(--text-tertiary)" }}>
              Railway Dashboard
            </span>
          </div>
        </div>
        <div className="main-body">
          <div className="empty-state">
            <div className="empty-state-icon">🚂</div>
            <div className="empty-state-title">Select a service</div>
            <div className="empty-state-desc">
              Choose a service from the sidebar to view deployments, logs, and configuration
            </div>
          </div>
        </div>
      </div>
    );
  }

  function getStatusBadgeClass(): string {
    if (!latestDeployment) return "stopped";
    switch (latestDeployment.status) {
      case DeploymentStatus.SUCCESS: return "running";
      case DeploymentStatus.BUILDING: return "building";
      case DeploymentStatus.DEPLOYING: return "deploying";
      case DeploymentStatus.FAILED: return "failed";
      case DeploymentStatus.CRASHED: return "crashed";
      case DeploymentStatus.SLEEPING: return "sleeping";
      default: return "stopped";
    }
  }

  function getStatusLabel(): string {
    if (!latestDeployment) return "No deployments";
    return latestDeployment.status.charAt(0) + latestDeployment.status.slice(1).toLowerCase();
  }

  return (
    <div className="main-content">
      <div className="main-header">
        <div className="header-left">
          <span style={{ fontSize: 20 }}>{service.icon}</span>
          <span className="header-service-name">{service.name}</span>
          <span className={`status-badge ${getStatusBadgeClass()}`}>
            <span className="status-dot" />
            {getStatusLabel()}
          </span>
          <span className="env-badge">production</span>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={handleDeploy}
            disabled={deployMutation.isPending || isDeploying}
          >
            {deployMutation.isPending ? <span className="spinner" /> : <Rocket size={14} />}
            Deploy
          </button>
          <button
            className="btn btn-ghost"
            onClick={handleRestart}
            disabled={restartMutation.isPending || !isRunning}
          >
            {restartMutation.isPending ? <span className="spinner" /> : <RotateCcw size={14} />}
            Restart
          </button>
          <button
            className="btn btn-danger"
            onClick={handleStop}
            disabled={stopMutation.isPending || (!isRunning && !isDeploying)}
          >
            {stopMutation.isPending ? <span className="spinner" /> : <Square size={14} />}
            Stop
          </button>
        </div>
      </div>

      {isDeploying && (
        <div style={{ padding: "0 24px", paddingTop: 0 }}>
          <div className="progress-bar">
            <div
              className={`progress-bar-fill ${
                latestDeployment?.status === DeploymentStatus.BUILDING ? "building" : "deploying"
              }`}
            />
          </div>
        </div>
      )}

      <div className="main-body">
        <div className="tab-bar">
          <button
            className={`tab-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
            Overview
          </button>
          <button
            className={`tab-item ${activeTab === "deployments" ? "active" : ""}`}
            onClick={() => setActiveTab("deployments")}
          >
            <Activity size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
            Deployments
          </button>
          <button
            className={`tab-item ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => setActiveTab("logs")}
          >
            <ScrollText size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
            Logs
          </button>
          <button
            className={`tab-item ${activeTab === "variables" ? "active" : ""}`}
            onClick={() => setActiveTab("variables")}
          >
            <Settings size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
            Variables
          </button>
        </div>

        {activeTab === "overview" && (
          <OverviewPanel
            service={service}
            project={project!}
            deployments={deployments || []}
            latestDeployment={latestDeployment || null}
          />
        )}
        {activeTab === "deployments" && (
          <DeploymentHistory deployments={deployments || []} loading={!deployments} />
        )}
        {activeTab === "logs" && (
          <LogsViewer deploymentId={latestDeployment?.id || null} />
        )}
        {activeTab === "variables" && (
          <EnvironmentVariables
            projectId={project?.id || null}
            serviceId={service.id}
          />
        )}
      </div>
    </div>
  );
}
