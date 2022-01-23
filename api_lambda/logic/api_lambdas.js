const {
    executeMutation
} = require('./helperFunctions')
const gql = require("graphql-tag");
const {
    createProject: createProjectMutation,
    createJob: createJobMutation,
    updateJob: updateJobMutation,
    createJobRun: createJobRunMutation,
    updateJobRun: updateJobRunMutation
} = require("../graphql/mutations")
const { v4: uuidv4 } = require('uuid');
const { getNowAWSDateTime } = require('./dates');
const createProject = async (client, { body, pathParameters }) => {
    const { company } = pathParameters
    const { name } = body
    return await executeMutation(
        client,
        createProjectMutation,
        "createProject",
        { id: uuidv4(), company, name }
    ) //id, name, company
}

const createJob = async (client, { body, pathParameters }) => {
    const { project_id } = pathParameters
    const { name, company } = body
    return await executeMutation(
        client,
        createJobMutation,
        "createJob",
        {
            id: uuidv4(),
            company,
            name,
            project_id,
            total_successes: 0,
            total_failures: 0,
            jobs_currently_running: 0,
            total_jobs: 0
        }
    ) //id, name, company, project_id
}


const startJob = async (client, dynamoClient, { body, pathParameters }) => {
    const { job_id } = pathParameters
    const { project_id } = body
    const job = await _getJob(dynamoClient, job_id)
    return Promise.all([
        executeMutation(
            client,
            createJobRunMutation,
            "createJobRun",
            {
                id: uuidv4(),
                project_id,
                job_id,
                status: "IN_PROGRESS",
                start_time: getNowAWSDateTime(Date.now())
            }
        ), //id, name, company, project_id, job_id, status, start_time
        executeMutation(
            client,
            updateJobMutation,
            "updateJob",
            { ...job, jobs_currently_running: job.jobs_currently_running + 1 }
        )
    ])
}

const timeDiff = (time1, time2) => {
    return Math.abs((new Date(time2)).getTime() - (new Date(time1)).getTime());
}
const _evolveJobFinish = ({
    id, company, project_id, total_failures,
    total_successes,
    average_job_in_seconds, total_jobs
}, { start_time, end_time, status }) => {
    const timeToRunJob = timeDiff(start_time, end_time)
    const didSucceed = status === "SUCCESS"
    const newTotalJobs = total_jobs + 1
    return {
        id,
        company,
        project_id,
        total_successes: total_successes + didSucceed ? 1 : 0,
        total_failures: total_failures + didSucceed ? 0 : 1,
        average_job_in_seconds: (timeToRunJob + average_job_in_seconds * total_jobs) / newTotalJobs,
        total_jobs: newTotalJobs,
        last_time_job_completed_successfully: didSucceed ? end_time : last_time_job_completed,
        last_time_job_completed: end_time,
        jobs_currently_running: 0
    }
}

const _getJob = (dynamoClient, id) => {
    return dynamoClient.get({
        TableName: process.env.TABLE_NAME,
        Key: {
            id
        },
    }).promise()
}

const _getJobRun = (dynamoClient, id) => {
    return dynamoClient.get({
        TableName: process.env.TABLE_NAME,
        Key: {
            id
        },
    }).promise()
}

const _getJobByProject = (dynamoClient, project_id) => {
    return dynamoClient.query({
        TableName: process.env.TABLE_NAME,
        Key: {
            project_id
        },
    }).promise()
}

const finishJob = async (client, dynamoClient, { body, pathParameters }) => {
    const { job_run_id, job_id } = pathParameters
    const { status } = body
    const { start_time } = await _getJobRun(dynamoClient, job_run_id)
    const end_time = getNowAWSDateTime(Date.now())
    const job = await _getJob(dynamoClient, job_id) // need to get all the parameters 
    const newJob = _evolveJobFinish(job, { start_time, end_time, status })
    return Promise.all([
        executeMutation(
            client,
            updateJobRunMutation,
            "updateJobRun",
            {
                id: job_run_id,
                company,
                project_id,
                job_id,
                status,
                start_time,
                end_time
            }
        ),
        executeMutation(
            client,
            updateJobMutation,
            "updateJob",
            newJob
        )
    ])
}

const getJobs = (dynamoClient, { pathParameters }) => {
    const { project_id } = pathParameters
    return _getJobByProject(dynamoClient, project_id)
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
    getJobRun
}