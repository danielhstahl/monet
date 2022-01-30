import {
  gql
} from "@apollo/client";
export const getProjects = gql`
  query GetProjects(
     $company: String!
     $nextToken: String
     $limit: String
  ) {
    getProjects(company: $company, nextToken: $nextToken, limit: $limit) {
      nextToken
      items
    }
  }
`;

export const getProjectsByName = gql`
  query GetProjectsByName(
     $project_name: String!
  ) {
    getProjectsByName(project_name: $project_name) {
      id
      project_name
      company
      created_date
    }
  }
`;

export const getJobsByProject = gql`
  query GetJobsByProject(
     $project_name: String!
     $company: String!
     $nextToken: String
     $limit: String
  ) {
    getJobsByProject(project_name: $project_name, company: $company, nextToken: $nextToken, limit: $limit) {
        nextToken
        items
    }
  }
`;

export const getJobs = gql`
  query GetJobs(
     $company: String!
     $nextToken: String
     $limit: String
  ) {
    getJobs(company: $company, nextToken: $nextToken, limit: $limit) {
        nextToken
        items
    }
  }
`;

export const getJobRuns = gql`
  query GetJobRuns(
     $job_id: String!
     $nextToken: String
     $limit: String
  ) {
    getJobRuns(job_id: $job_id, nextToken: $nextToken, limit: $limit) {
        nextToken
        items
    }
  }
`;

export const getLastNJobRuns = gql`
  query GetLastNJobRuns(
     $job_id: String!
     $n: Int
  ) {
    getLastNJobRuns(job_id: $job_id, n: $n) {
        id
        job_id
        start_time
        end_time
        job_status
    }
  }
`;