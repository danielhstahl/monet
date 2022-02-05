const { _evolveJobFinish } = require("./api_lambdas")

describe("evolveJobFinish", () => {
    it("successfully evolves job status at first evolution and sucess", () => {
        const job = {
            id: "myjobid",
            company: "mycompany",
            project_id: "myproject",
            last_time_job_completed_successfully: null,
            total_failures: 0,
            total_successes: 0,
            average_job_length_in_seconds: null,
            total_jobs: 0,
            jobs_currently_running: 1
        }
        const result = _evolveJobFinish(job, {
            start_time: "2022-01-25T12:02:43.303Z",
            end_time: "2022-01-25T12:06:43.303Z",
            job_status: "SUCCESS"
        })
        expect(result).toEqual({
            id: "myjobid",
            company: "mycompany",
            project_id: "myproject",
            total_successes: 1,
            total_failures: 0,
            average_job_length_in_seconds: 240,
            total_jobs: 1,
            last_time_job_completed_successfully: "2022-01-25T12:06:43.303Z",
            last_time_job_completed: "2022-01-25T12:06:43.303Z",
            jobs_currently_running: 0
        })
    })
    it("successfully evolves job status at first evolution and failure", () => {
        const job = {
            id: "myjobid",
            company: "mycompany",
            project_id: "myproject",
            last_time_job_completed_successfully: null,
            total_failures: 0,
            total_successes: 0,
            average_job_length_in_seconds: null,
            total_jobs: 0,
            jobs_currently_running: 1
        }
        const result = _evolveJobFinish(job, {
            start_time: "2022-01-25T12:02:43.303Z",
            end_time: "2022-01-25T12:06:43.303Z",
            job_status: "FAILURE"
        })
        expect(result).toEqual({
            id: "myjobid",
            company: "mycompany",
            project_id: "myproject",
            total_successes: 0,
            total_failures: 1,
            average_job_length_in_seconds: 240,
            total_jobs: 1,
            last_time_job_completed_successfully: null,
            last_time_job_completed: "2022-01-25T12:06:43.303Z",
            jobs_currently_running: 0
        })
    })
    it("successfully evolves job status at second evolution and success", () => {
        const job = {
            id: "myjobid",
            company: "mycompany",
            project_id: "myproject",
            last_time_job_completed_successfully: "2022-01-25T12:06:43.303Z",
            total_failures: 0,
            total_successes: 1,
            average_job_length_in_seconds: 240,
            total_jobs: 1,
            jobs_currently_running: 1
        }
        const result = _evolveJobFinish(job, {
            start_time: "2022-01-25T12:05:43.303Z",
            end_time: "2022-01-25T12:07:43.303Z",
            job_status: "SUCCESS"
        })
        expect(result).toEqual({
            id: "myjobid",
            company: "mycompany",
            project_id: "myproject",
            total_successes: 2,
            total_failures: 0,
            average_job_length_in_seconds: 180,
            total_jobs: 2,
            last_time_job_completed_successfully: "2022-01-25T12:07:43.303Z",
            last_time_job_completed: "2022-01-25T12:07:43.303Z",
            jobs_currently_running: 0
        })
    })
    it("successfully evolves job status at second evolution and failure", () => {
        const job = {
            id: "myjobid",
            company: "mycompany",
            project_id: "myproject",
            last_time_job_completed_successfully: "2022-01-25T12:06:43.303Z",
            total_failures: 0,
            total_successes: 1,
            average_job_length_in_seconds: 240,
            total_jobs: 1,
            jobs_currently_running: 1
        }
        const result = _evolveJobFinish(job, {
            start_time: "2022-01-25T12:05:43.303Z",
            end_time: "2022-01-25T12:07:43.303Z",
            job_status: "FAILURE"
        })
        expect(result).toEqual({
            id: "myjobid",
            company: "mycompany",
            project_id: "myproject",
            total_successes: 1,
            total_failures: 1,
            average_job_length_in_seconds: 180,
            total_jobs: 2,
            last_time_job_completed_successfully: "2022-01-25T12:06:43.303Z",
            last_time_job_completed: "2022-01-25T12:07:43.303Z",
            jobs_currently_running: 0
        })
    })
})
