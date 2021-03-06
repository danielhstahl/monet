import {
  gql
} from "@apollo/client";

export const CREATE_PROJECT = gql`
mutation CreateProject(
     $project_name: String!
     $company: String!
  ) {
    addProject(project_name: $project_name, company: $company) {
      id
      project_name
      company
      created_date
    }
  }
`;

export const CREATE_API_KEY = gql`
mutation AddApiKey(
  $user_id: String!
  $project_id: String!
){
  addApiKey(user_id:  $user_id, project_id: $project_id){
    api_key
  }
}
`

export const createJob = gql`
  mutation CreateJob(
    $job_name: String!
    $company: String! 
    $project_id: String!
  ) {
    addJob(
      job_name: $job_name, company: $company, project_id: $project_id
    ) {
      id
      job_name
      company
      project_id
      created_date
    }
  }
`;

export const updateJob = gql`
  mutation UpdateJob(
    $id: ID!
    $last_time_job_completed: String
    $last_time_job_completed_successfully:String
    $total_successes: Int!
    $total_failures: Int!
    $jobs_currently_running: Int!
    $average_job_length_in_seconds: Float
    $total_jobs: Int!
  ) {
    updateJob(
        id: $id, 
        last_time_job_completed: $last_time_job_completed,
        last_time_job_completed_successfully: $last_time_job_completed_successfully,
        total_successes: $total_successes,
        total_failures: $total_failures,
        jobs_currently_running: $jobs_currently_running,
        average_job_length_in_seconds: $average_job_length_in_seconds,
        total_jobs: $total_jobs
    ) {
      id
      company
      project_id
      last_time_job_completed
      last_time_job_completed_successfully
      total_successes
      total_failures
      jobs_currently_running
      average_job_length_in_seconds
      total_jobs
    }
  }
`;

export const createJobRun = gql`
  mutation CreateJobRun(
    $job_id: String!
    $status: JobStatusEnum!
    $start_time: AWSDateTime!
  ) {
    addJobRun( job_id: $job_id, status: $status, start_time: $start_time ) {
      id
      job_id
      status 
      start_time
    }
  }
`;

export const updateJobRun = gql`
  mutation UpdateJobRun(
    $id: ID!
    $status: JobStatusEnum!
    $end_time: AWSDateTime
  ) {
    updateJobRun(id: $id,  status: $status, end_time: $end_time) {
      id
      job_id
      status 
      start_time
      end_time
    }
  }
`;