import {
  gql
} from "@apollo/client";
export const addedProjects = gql`
  subscription GetProjects(
     $company: String!
  ) {
    getProjects(company: $company) {
      id
      project_name
      company
      created_date
    }
  }
`;


export const addedJob = gql`
  subscription AddedJob(
     $company: String!
  ) {
    addedJob(company: $company) {
      id
      job_name
      project_id 
      company
      last_time_job_completed
      last_time_job_completed_successfully
      total_successes
      total_failures
      jobs_currently_running
      average_job_length_in_seconds
      total_jobs
      created_date
    }
  }
`;

export const addedJobByProject = gql`
  subscription AddedJobByProject(
     $company: String!
     $project_id: String!
  ) {
    addedJobByProject(company: $company, project_id: $project_id) {
      id
      job_name
      project_id 
      company
      last_time_job_completed
      last_time_job_completed_successfully
      total_successes
      total_failures
      jobs_currently_running
      average_job_length_in_seconds
      total_jobs
      created_date
    }
  }
`;


export const addedJobRuns = gql`
  subscription AddedJobByProject(
     $job_id: String!
  ) {
    addedJobByProject(job_id: $job_id) {
      id
      job_name
      start_time
      end_time 
      job_status
    }
  }
`;