import { GraphQLClient, gql } from "graphql-request";
import { RAILWAY_API_ENDPOINT } from "../utils/constants";
import type { Project, Deployment, LogEntry, Variable } from "../types/railway";
import {
  mockFetchProjects,
  mockFetchDeployments,
  mockFetchLogs,
  mockFetchVariables,
  mockTriggerDeploy,
  mockStopDeployment,
  mockRestartDeployment,
  mockUpsertVariable,
  mockDeleteVariable,
} from "./mockData";

const token = import.meta.env.VITE_RAILWAY_TOKEN as string | undefined;
const isLiveMode = !!token;

const client = isLiveMode
  ? new GraphQLClient(RAILWAY_API_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    })
  : null;

const PROJECTS_QUERY = gql`
  query {
    projects {
      edges {
        node {
          id
          name
          description
          createdAt
          updatedAt
          environments {
            edges {
              node {
                id
                name
                isEphemeral
              }
            }
          }
          services {
            edges {
              node {
                id
                name
                icon
                projectId
                createdAt
                updatedAt
              }
            }
          }
        }
      }
    }
  }
`;

const DEPLOYMENTS_QUERY = gql`
  query deployments($serviceId: String!, $environmentId: String!) {
    deployments(
      first: 10
      input: { serviceId: $serviceId, environmentId: $environmentId }
    ) {
      edges {
        node {
          id
          status
          createdAt
          updatedAt
          staticUrl
          meta
        }
      }
    }
  }
`;

const DEPLOY_LOGS_QUERY = gql`
  query deploymentLogs($deploymentId: String!) {
    deploymentLogs(deploymentId: $deploymentId, limit: 100) {
      message
      severity
      timestamp
    }
  }
`;

const VARIABLES_QUERY = gql`
  query variables($projectId: String!, $environmentId: String!, $serviceId: String!) {
    variables(
      projectId: $projectId
      environmentId: $environmentId
      serviceId: $serviceId
    )
  }
`;

const DEPLOY_MUTATION = gql`
  mutation serviceInstanceDeploy($serviceId: String!, $environmentId: String!) {
    serviceInstanceDeploy(serviceId: $serviceId, environmentId: $environmentId)
  }
`;

const STOP_MUTATION = gql`
  mutation deploymentStop($id: String!) {
    deploymentStop(id: $id)
  }
`;

const RESTART_MUTATION = gql`
  mutation deploymentRestart($id: String!) {
    deploymentRestart(id: $id)
  }
`;

const VARIABLE_UPSERT_MUTATION = gql`
  mutation variableUpsert(
    $projectId: String!
    $environmentId: String!
    $serviceId: String!
    $name: String!
    $value: String!
  ) {
    variableUpsert(
      input: {
        projectId: $projectId
        environmentId: $environmentId
        serviceId: $serviceId
        name: $name
        value: $value
      }
    )
  }
`;

const VARIABLE_DELETE_MUTATION = gql`
  mutation variableDelete(
    $projectId: String!
    $environmentId: String!
    $serviceId: String!
    $name: String!
  ) {
    variableDelete(
      input: {
        projectId: $projectId
        environmentId: $environmentId
        serviceId: $serviceId
        name: $name
      }
    )
  }
`;

export async function fetchProjects(): Promise<Project[]> {
  if (!isLiveMode) return mockFetchProjects();

  const data: any = await client!.request(PROJECTS_QUERY);
  return data.projects.edges.map((edge: any) => ({
    id: edge.node.id,
    name: edge.node.name,
    description: edge.node.description || "",
    createdAt: edge.node.createdAt,
    updatedAt: edge.node.updatedAt,
    environments: edge.node.environments.edges.map((e: any) => e.node),
    services: edge.node.services.edges.map((s: any) => s.node),
  }));
}

export async function fetchDeployments(
  serviceId: string,
  environmentId?: string
): Promise<Deployment[]> {
  if (!isLiveMode) return mockFetchDeployments(serviceId);

  const data: any = await client!.request(DEPLOYMENTS_QUERY, {
    serviceId,
    environmentId: environmentId || "",
  });
  return data.deployments.edges.map((edge: any) => edge.node);
}

export async function fetchLogs(deploymentId: string): Promise<LogEntry[]> {
  if (!isLiveMode) return mockFetchLogs(deploymentId);

  const data: any = await client!.request(DEPLOY_LOGS_QUERY, { deploymentId });
  return data.deploymentLogs;
}

export async function fetchVariables(
  projectId: string,
  environmentId: string,
  serviceId: string
): Promise<Variable[]> {
  if (!isLiveMode) return mockFetchVariables(serviceId);

  const data: any = await client!.request(VARIABLES_QUERY, {
    projectId,
    environmentId,
    serviceId,
  });
  return Object.entries(data.variables || {}).map(([name, value]) => ({
    name,
    value: value as string,
  }));
}

export async function triggerDeploy(
  serviceId: string,
  environmentId?: string
): Promise<Deployment> {
  if (!isLiveMode) return mockTriggerDeploy(serviceId);

  const data: any = await client!.request(DEPLOY_MUTATION, {
    serviceId,
    environmentId: environmentId || "",
  });
  return data.serviceInstanceDeploy;
}

export async function stopDeployment(deploymentId: string): Promise<boolean> {
  if (!isLiveMode) return mockStopDeployment(deploymentId);

  await client!.request(STOP_MUTATION, { id: deploymentId });
  return true;
}

export async function restartDeployment(deploymentId: string): Promise<boolean> {
  if (!isLiveMode) return mockRestartDeployment(deploymentId);

  await client!.request(RESTART_MUTATION, { id: deploymentId });
  return true;
}

export async function upsertVariable(
  projectId: string,
  environmentId: string,
  serviceId: string,
  name: string,
  value: string
): Promise<boolean> {
  if (!isLiveMode) return mockUpsertVariable(serviceId, name, value);

  await client!.request(VARIABLE_UPSERT_MUTATION, {
    projectId,
    environmentId,
    serviceId,
    name,
    value,
  });
  return true;
}

export async function deleteVariable(
  projectId: string,
  environmentId: string,
  serviceId: string,
  name: string
): Promise<boolean> {
  if (!isLiveMode) return mockDeleteVariable(serviceId, name);

  await client!.request(VARIABLE_DELETE_MUTATION, {
    projectId,
    environmentId,
    serviceId,
    name,
  });
  return true;
}

void VARIABLE_UPSERT_MUTATION;
void VARIABLE_DELETE_MUTATION;
