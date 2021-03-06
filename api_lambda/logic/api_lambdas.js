const {
    executeMutation
} = require('./helperFunctions')
const {
    createProject: createProjectMutation,
    createJob: createJobMutation,
    updateJob: updateJobMutation,
    createJobRun: createJobRunMutation,
    updateJobRun: updateJobRunMutation,
    updateProject: updateProjectMutation
} = require("../graphql/mutations")
const { dateToAws } = require('./dates');
const STATUS = {
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    IN_PROGRESS: "IN_PROGRESS"
}
const createProject = (client, { body }) => {
    const { name, company } = body
    return executeMutation(
        client,
        createProjectMutation,
        "addProject",
        { company, project_name: name }
    ) //id, name, company
}

const createJob = (client, dynamoClient, { body, pathParameters }) => {
    const { project_id } = pathParameters
    const { name, company } = body
    return Promise.all([
        executeMutation(
            client,
            createJobMutation,
            "addJob",
            {
                company,
                job_name: name,
                project_id
            }
        ), //id, name, company, project_id
        _getProject(dynamoClient, project_id).then(project => executeMutation(
            client,
            updateProjectMutation,
            "updateProject",
            {
                id: project_id,
                total_jobs: project.total_jobs + 1
            }
        ))
    ]).then(([result]) => result)
}


const startJob = (client, dynamoClient, { pathParameters }) => {
    const { job_id } = pathParameters
    return Promise.all([
        executeMutation(
            client,
            createJobRunMutation,
            "addJobRun",
            {
                job_id,
                job_status: STATUS.IN_PROGRESS,
                start_time: dateToAws(Date.now())
            }
        ), //id, name, company, project_id, job_id, status, start_time
        _getJob(dynamoClient, job_id).then(job => {
            return executeMutation(
                client,
                updateJobMutation,
                "updateJob",
                { ...job, jobs_currently_running: job.jobs_currently_running + 1 }
            )
        })
    ]).then(([result]) => result)
}
const MS_IN_SECONDS = 1000
const timeDiff = (time1, time2) => {
    return Math.abs(((new Date(time2)).getTime() - (new Date(time1)).getTime()) / MS_IN_SECONDS);
}

//export for testing
const _evolveJobFinish = ({
    id, company, project_id, total_failures,
    total_successes, last_time_job_completed_successfully,
    average_job_length_in_seconds, total_jobs, jobs_currently_running
}, { start_time, end_time, job_status }) => {
    const timeToRunJob = timeDiff(start_time, end_time)
    const didSucceed = job_status === STATUS.SUCCESS
    const newTotalJobs = total_jobs + 1
    const avg_job_in_seconds = average_job_length_in_seconds || 0
    return {
        id,
        company,
        project_id,
        total_successes: total_successes + (didSucceed ? 1 : 0),
        total_failures: total_failures + (didSucceed ? 0 : 1),
        average_job_length_in_seconds: (timeToRunJob + avg_job_in_seconds * total_jobs) / newTotalJobs,
        total_jobs: newTotalJobs,
        last_time_job_completed_successfully: didSucceed ? end_time : last_time_job_completed_successfully,
        last_time_job_completed: end_time,
        jobs_currently_running: Math.max(jobs_currently_running - 1, 0)
    }
}

const _getItem = (dynamoClient, id, table_name) => {
    return dynamoClient.get({
        TableName: table_name,
        Key: {
            id
        }
    }).promise().then(data => data.Item)
}

const _getJob = (dynamoClient, id) => {
    return _getItem(dynamoClient, id, process.env.JOB_TABLE_NAME)
}

const _getJobRun = (dynamoClient, id) => {
    return _getItem(dynamoClient, id, process.env.JOB_RUN_TABLE_NAME)
}

const _getProject = (dynamoClient, id) => {
    return _getItem(dynamoClient, id, process.env.PROJECT_TABLE_NAME)
}

const _getJobByProject = (dynamoClient, company, project_id) => {
    return dynamoClient.query({
        TableName: process.env.JOB_TABLE_NAME,
        KeyConditionExpression: 'project_id = :project_id and company = :company',
        ExpressionAttributeValues: { ':project_id': project_id, ':company': company },
        IndexName: "company_index"
    }).promise().then(data => data.Items)
}

const finishJob = async (client, dynamoClient, { body, pathParameters }) => {
    const { job_run_id, job_id } = pathParameters
    const { job_status } = body
    const end_time = dateToAws(Date.now())
    const job = await _getJob(dynamoClient, job_id) //this goes first in case the job_id is incorrect
    const result = await executeMutation(
        client,
        updateJobRunMutation,
        "updateJobRun",
        {
            id: job_run_id,
            job_status,
            end_time
        }
    )
    const newJob = _evolveJobFinish(job, { start_time: result.start_time, end_time, job_status })
    await executeMutation(
        client,
        updateJobMutation,
        "updateJob",
        newJob
    )
    return result
}

const getJobs = async (dynamoClient, { pathParameters }) => {
    const { project_id } = pathParameters
    const { company } = await _getProject(dynamoClient, project_id)
    return _getJobByProject(dynamoClient, company, project_id)
}

const getJobRun = (dynamoClient, { pathParameters }) => {
    const { job_run_id } = pathParameters
    return _getJobRun(dynamoClient, job_run_id)
}

module.exports = {
    finishJob,
    createProject,
    startJob,
    createJob,
    getJobs,
    getJobRun,
    _evolveJobFinish //exported for testing
}