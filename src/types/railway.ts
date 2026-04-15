export const DeploymentStatus = {
  BUILDING: "BUILDING",
  DEPLOYING: "DEPLOYING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CRASHED: "CRASHED",
  REMOVED: "REMOVED",
  SLEEPING: "SLEEPING",
  SKIPPED: "SKIPPED",
  WAITING: "WAITING",
  QUEUED: "QUEUED",
} as const;

export type DeploymentStatus = typeof DeploymentStatus[keyof typeof DeploymentStatus];

export interface Environment {
  id: string;
  name: string;
  isEphemeral: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  environments: Environment[];
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  latestDeployment?: Deployment;
}

export interface Deployment {
  id: string;
  serviceId: string;
  environmentId: string;
  status: DeploymentStatus;
  createdAt: string;
  updatedAt: string;
  commitMessage?: string;
  commitHash?: string;
  branch?: string;
  staticUrl?: string;
}

export interface LogEntry {
  message: string;
  severity: "info" | "warn" | "error" | "debug";
  timestamp: string;
}

export interface Variable {
  name: string;
  value: string;
}

export interface ServiceWithStatus extends Service {
  status: DeploymentStatus;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
