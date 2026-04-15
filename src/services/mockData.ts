import {
  type Project,
  type Service,
  type Deployment,
  type LogEntry,
  type Variable,
  DeploymentStatus,
} from "../types/railway";
import { generateId } from "../utils/formatters";

const MOCK_ENV_ID = "env-prod-001";

function randomDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo));
  d.setHours(Math.floor(Math.random() * 24));
  d.setMinutes(Math.floor(Math.random() * 60));
  return d.toISOString();
}

function recentDate(minutesAgo: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
}

const serviceTemplates = [
  { name: "web-api", icon: "🌐" },
  { name: "postgres", icon: "🐘" },
  { name: "redis-cache", icon: "⚡" },
  { name: "worker-queue", icon: "⚙️" },
  { name: "auth-service", icon: "🔐" },
  { name: "cron-jobs", icon: "⏰" },
];

const commitMessages = [
  "fix: resolve connection pool timeout issue",
  "feat: add rate limiting middleware",
  "chore: update dependencies to latest",
  "fix: handle null user sessions gracefully",
  "feat: implement webhook retry logic",
  "perf: optimize database query for user lookup",
  "feat: add health check endpoint",
  "fix: correct CORS headers for production",
  "chore: migrate to Node 20 LTS",
  "feat: add structured logging with pino",
];

const logMessages = [
  { msg: "Server listening on port 3000", sev: "info" as const },
  { msg: "Connected to PostgreSQL database", sev: "info" as const },
  { msg: "Redis connection established", sev: "info" as const },
  { msg: "Health check passed", sev: "info" as const },
  { msg: "GET /api/v1/users 200 12ms", sev: "info" as const },
  { msg: "POST /api/v1/auth/login 200 45ms", sev: "info" as const },
  { msg: "GET /api/v1/projects 200 8ms", sev: "info" as const },
  { msg: "Rate limit applied for IP 192.168.1.100", sev: "warn" as const },
  { msg: "Slow query detected: SELECT * FROM deployments (230ms)", sev: "warn" as const },
  { msg: "Connection pool reaching capacity (85%)", sev: "warn" as const },
  { msg: "Failed to send webhook notification", sev: "error" as const },
  { msg: "Unhandled promise rejection caught", sev: "error" as const },
  { msg: "JWT token validation: token verified", sev: "debug" as const },
  { msg: "Cache HIT for key: user:session:abc123", sev: "debug" as const },
  { msg: "Middleware chain executed in 2ms", sev: "debug" as const },
  { msg: "Worker processing job batch #4521", sev: "info" as const },
  { msg: "Cron job [cleanup-sessions] completed", sev: "info" as const },
  { msg: "Memory usage: 128MB / 512MB", sev: "info" as const },
  { msg: "Graceful shutdown initiated", sev: "info" as const },
  { msg: "All pending requests drained", sev: "info" as const },
];

function createDeployments(serviceId: string): Deployment[] {
  const statuses: DeploymentStatus[] = [
    DeploymentStatus.SUCCESS,
    DeploymentStatus.SUCCESS,
    DeploymentStatus.SUCCESS,
    DeploymentStatus.FAILED,
    DeploymentStatus.SUCCESS,
    DeploymentStatus.SUCCESS,
  ];

  return statuses.map((status, i) => ({
    id: `deploy-${serviceId}-${i}`,
    serviceId,
    environmentId: MOCK_ENV_ID,
    status,
    createdAt: recentDate((i + 1) * 60 + Math.floor(Math.random() * 60)),
    updatedAt: recentDate(i * 60 + Math.floor(Math.random() * 30)),
    commitMessage: commitMessages[Math.floor(Math.random() * commitMessages.length)],
    commitHash: generateId().substring(0, 12),
    branch: "main",
  }));
}

let mockProjects: Project[] | null = null;
let mockDeployments: Map<string, Deployment[]> = new Map();
let deployingServices: Set<string> = new Set();

function initMockData(): Project[] {
  if (mockProjects) return mockProjects;

  const services1: Service[] = serviceTemplates.slice(0, 4).map((t, i) => {
    const svcId = `svc-proj1-${i}`;
    const deployments = createDeployments(svcId);
    mockDeployments.set(svcId, deployments);
    return {
      id: svcId,
      name: t.name,
      icon: t.icon,
      projectId: "proj-001",
      createdAt: randomDate(90),
      updatedAt: recentDate(30),
      latestDeployment: deployments[0],
    };
  });

  const services2: Service[] = serviceTemplates.slice(2, 6).map((t, i) => {
    const svcId = `svc-proj2-${i}`;
    const deployments = createDeployments(svcId);
    mockDeployments.set(svcId, deployments);
    return {
      id: svcId,
      name: t.name,
      icon: t.icon,
      projectId: "proj-002",
      createdAt: randomDate(60),
      updatedAt: recentDate(120),
      latestDeployment: deployments[0],
    };
  });

  services1[2].latestDeployment = {
    ...services1[2].latestDeployment!,
    status: DeploymentStatus.SLEEPING,
  };

  mockProjects = [
    {
      id: "proj-001",
      name: "production-api",
      description: "Main production API and supporting services",
      createdAt: randomDate(120),
      updatedAt: recentDate(5),
      environments: [
        { id: MOCK_ENV_ID, name: "production", isEphemeral: false },
        { id: "env-staging-001", name: "staging", isEphemeral: false },
      ],
      services: services1,
    },
    {
      id: "proj-002",
      name: "data-pipeline",
      description: "Data processing and analytics pipeline",
      createdAt: randomDate(60),
      updatedAt: recentDate(60),
      environments: [
        { id: "env-prod-002", name: "production", isEphemeral: false },
      ],
      services: services2,
    },
  ];

  return mockProjects;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockFetchProjects(): Promise<Project[]> {
  await delay(600);
  return initMockData();
}

export async function mockFetchDeployments(serviceId: string): Promise<Deployment[]> {
  await delay(400);
  initMockData();
  return mockDeployments.get(serviceId) || [];
}

export async function mockFetchLogs(deploymentId: string): Promise<LogEntry[]> {
  await delay(200);
  void deploymentId;
  const now = new Date();
  const count = 15 + Math.floor(Math.random() * 10);
  const logs: LogEntry[] = [];

  for (let i = 0; i < count; i++) {
    const template = logMessages[Math.floor(Math.random() * logMessages.length)];
    const ts = new Date(now.getTime() - (count - i) * 1000 * (1 + Math.random() * 2));
    logs.push({
      message: template.msg,
      severity: template.sev,
      timestamp: ts.toISOString(),
    });
  }

  return logs;
}

export async function mockFetchVariables(serviceId: string): Promise<Variable[]> {
  await delay(300);
  void serviceId;
  return [
    { name: "DATABASE_URL", value: "postgresql://user:****@postgres.railway.internal:5432/railway" },
    { name: "REDIS_URL", value: "redis://default:****@redis.railway.internal:6379" },
    { name: "PORT", value: "3000" },
    { name: "NODE_ENV", value: "production" },
    { name: "JWT_SECRET", value: "••••••••••••••••" },
    { name: "API_KEY", value: "••••••••••••••••" },
    { name: "LOG_LEVEL", value: "info" },
    { name: "CORS_ORIGIN", value: "https://app.example.com" },
  ];
}

export async function mockTriggerDeploy(serviceId: string): Promise<Deployment> {
  await delay(1200);
  initMockData();

  const newDeployment: Deployment = {
    id: `deploy-${generateId()}`,
    serviceId,
    environmentId: MOCK_ENV_ID,
    status: DeploymentStatus.BUILDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    commitMessage: "feat: triggered manual deployment",
    commitHash: generateId().substring(0, 12),
    branch: "main",
  };

  const existing = mockDeployments.get(serviceId) || [];
  mockDeployments.set(serviceId, [newDeployment, ...existing]);

  deployingServices.add(serviceId);

  if (mockProjects) {
    for (const proj of mockProjects) {
      const svc = proj.services.find((s) => s.id === serviceId);
      if (svc) {
        svc.latestDeployment = newDeployment;
      }
    }
  }

  setTimeout(() => {
    newDeployment.status = DeploymentStatus.DEPLOYING;
    newDeployment.updatedAt = new Date().toISOString();
    if (mockProjects) {
      for (const proj of mockProjects) {
        const svc = proj.services.find((s) => s.id === serviceId);
        if (svc) svc.latestDeployment = { ...newDeployment };
      }
    }
  }, 3000);

  setTimeout(() => {
    newDeployment.status = DeploymentStatus.SUCCESS;
    newDeployment.updatedAt = new Date().toISOString();
    deployingServices.delete(serviceId);
    if (mockProjects) {
      for (const proj of mockProjects) {
        const svc = proj.services.find((s) => s.id === serviceId);
        if (svc) svc.latestDeployment = { ...newDeployment };
      }
    }
  }, 7000);

  return newDeployment;
}

export async function mockStopDeployment(deploymentId: string): Promise<boolean> {
  await delay(800);
  initMockData();

  for (const [, deployments] of mockDeployments) {
    const dep = deployments.find((d) => d.id === deploymentId);
    if (dep) {
      dep.status = DeploymentStatus.SLEEPING;
      dep.updatedAt = new Date().toISOString();
      if (mockProjects) {
        for (const proj of mockProjects) {
          const svc = proj.services.find((s) => s.id === dep.serviceId);
          if (svc && svc.latestDeployment?.id === deploymentId) {
            svc.latestDeployment = { ...dep };
          }
        }
      }
      return true;
    }
  }
  return false;
}

export async function mockRestartDeployment(deploymentId: string): Promise<boolean> {
  await delay(1000);
  initMockData();

  for (const [serviceId, deployments] of mockDeployments) {
    const dep = deployments.find((d) => d.id === deploymentId);
    if (dep) {
      dep.status = DeploymentStatus.DEPLOYING;
      dep.updatedAt = new Date().toISOString();
      if (mockProjects) {
        for (const proj of mockProjects) {
          const svc = proj.services.find((s) => s.id === dep.serviceId);
          if (svc) svc.latestDeployment = { ...dep };
        }
      }

      setTimeout(() => {
        dep.status = DeploymentStatus.SUCCESS;
        dep.updatedAt = new Date().toISOString();
        deployingServices.delete(serviceId);
        if (mockProjects) {
          for (const proj of mockProjects) {
            const svc = proj.services.find((s) => s.id === dep.serviceId);
            if (svc) svc.latestDeployment = { ...dep };
          }
        }
      }, 4000);

      return true;
    }
  }
  return false;
}

export async function mockUpsertVariable(
  _serviceId: string,
  name: string,
  value: string
): Promise<boolean> {
  await delay(500);
  void _serviceId;
  void name;
  void value;
  return true;
}

export async function mockDeleteVariable(
  _serviceId: string,
  name: string
): Promise<boolean> {
  await delay(500);
  void _serviceId;
  void name;
  return true;
}
