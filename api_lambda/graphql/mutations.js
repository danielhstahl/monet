const createProject = /* GraphQL */ `
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
const updateProject = /* GraphQL */ `
  mutation UpdateProject(
     $id: String!
     $total_jobs: Int!
  ) {
    updateProject(id: $id, total_jobs: $total_jobs) {
      id
      project_name
      company
      created_date
      total_jobs
    }
  }
`;
const createJob = /* GraphQL */ `
  mutation CreateJob(
    $job_name: String!
    $company: String! 
    $project_id: String!
    $url_to_job_page: String
  ) {
    addJob(
      job_name: $job_name, company: $company, project_id: $project_id, url_to_job_page: $url_to_job_page
    ) {
      id
      job_name
      company
      project_id
      created_date
      url_to_job_page
    }
  }
`;

const updateJob = /* GraphQL */ `
  mutation UpdateJob(
    $id: String!
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

const createJobRun = /* GraphQL */ `
  mutation CreateJobRun(
    $job_id: String!
    $job_status: JobStatusEnum!
    $start_time: AWSDateTime!
  ) {
    addJobRun( job_id: $job_id, job_status: $job_status, start_time: $start_time ) {
      id
      job_id
      job_status 
      start_time
    }
  }
`;

const updateJobRun = /* GraphQL */ `
  mutation UpdateJobRun(
    $id: String!
    $job_status: JobStatusEnum!
    $end_time: AWSDateTime
  ) {
    updateJobRun(id: $id,  job_status: $job_status, end_time: $end_time) {
      id
      job_id
      job_status 
      start_time
      end_time
    }
  }
`;


module.exports = {
  createProject,
  createJob,
  updateJob,
  createJobRun,
  updateJobRun,
  updateProject
}