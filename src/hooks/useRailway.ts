import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  fetchDeployments,
  fetchLogs,
  fetchVariables,
  triggerDeploy,
  stopDeployment,
  restartDeployment,
} from "../services/railwayApi";
import { useDashboardStore } from "../stores/dashboardStore";
import { DeploymentStatus } from "../types/railway";
import { LOGS_POLL_INTERVAL, DEPLOYMENT_POLL_INTERVAL, PROJECTS_STALE_TIME } from "../utils/constants";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: PROJECTS_STALE_TIME,
    refetchInterval: 15000,
  });
}

export function useDeployments(serviceId: string | null) {
  const environmentId = useDashboardStore((s: any) => s.selectedEnvironmentId);

  return useQuery({
    queryKey: ["deployments", serviceId, environmentId],
    queryFn: () => fetchDeployments(serviceId!, environmentId),
    enabled: !!serviceId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return DEPLOYMENT_POLL_INTERVAL;
      const hasActiveDeployment = data.some(
        (d) =>
          d.status === DeploymentStatus.BUILDING ||
          d.status === DeploymentStatus.DEPLOYING ||
          d.status === DeploymentStatus.QUEUED
      );
      return hasActiveDeployment ? DEPLOYMENT_POLL_INTERVAL : 30000;
    },
  });
}

export function useLogs(deploymentId: string | null) {
  const paused = useDashboardStore((s: any) => s.logsPaused);

  return useQuery({
    queryKey: ["logs", deploymentId],
    queryFn: () => fetchLogs(deploymentId!),
    enabled: !!deploymentId && !paused,
    refetchInterval: paused ? false : LOGS_POLL_INTERVAL,
  });
}

export function useVariables(
  projectId: string | null,
  serviceId: string | null
) {
  const environmentId = useDashboardStore((s) => s.selectedEnvironmentId);

  return useQuery({
    queryKey: ["variables", projectId, environmentId, serviceId],
    queryFn: () => fetchVariables(projectId!, environmentId, serviceId!),
    enabled: !!projectId && !!serviceId,
  });
}

export function useDeployAction() {
  const queryClient = useQueryClient();
  const showToast = useDashboardStore((s: any) => s.showToast);

  const deployMutation = useMutation({
    mutationFn: ({ serviceId, environmentId }: { serviceId: string; environmentId?: string }) =>
      triggerDeploy(serviceId, environmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showToast("success", "Deployment triggered successfully");
    },
    onError: () => {
      showToast("error", "Failed to trigger deployment");
    },
  });

  const stopMutation = useMutation({
    mutationFn: (deploymentId: string) => stopDeployment(deploymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showToast("info", "Service stopped");
    },
    onError: () => {
      showToast("error", "Failed to stop deployment");
    },
  });

  const restartMutation = useMutation({
    mutationFn: (deploymentId: string) => restartDeployment(deploymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deployments"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      showToast("success", "Restart initiated");
    },
    onError: () => {
      showToast("error", "Failed to restart deployment");
    },
  });

  return { deployMutation, stopMutation, restartMutation };
}
