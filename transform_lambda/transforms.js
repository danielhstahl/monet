const { awsToUnixFormat } = require('./dates')
const { diff } = require('deep-diff')

const NEW_RECORD_INDICATOR = "INSERT"
const extractProjectInfo = body => {
    const {
        id, name, company, created_date
    } = body
    return {
        project_id: id.S,
        name: name.S,
        company: company.S,
        created_date: awsToUnixFormat(created_date.S)
    }
}
exports.projectInfo = payload => {
    const currProjectInfo = extractProjectInfo(payload.dynamodb.NewImage)
    const logDate = payload.dynamodb.ApproximateCreationDateTime
    console.log("PROJECT INFO:", JSON.stringify(currProjectInfo, null, 2))
    if (payload.eventName === NEW_RECORD_INDICATOR) { //in this case, no old image
        return { ...currProjectInfo, log_date: logDate }
    }
    const prevProjectInfo = extractProjectInfo(payload.dynamodb.OldImage)
    console.log("PREVIOUS INFO:", JSON.stringify(prevProjectInfo, null, 2))
    if (diff(prevProjectInfo, currProjectInfo)) { //this shouldnt happen, but if it does....
        return { ...currProjectInfo, log_date: logDate }
    }
}

//extract only a subset of data
const extractJobInfo = body => {
    const {
        id, name, company, created_date, project_id
    } = body
    return {
        job_id: id.S,
        name: name.S,
        company: company.S,
        project_id: project_id.S,
        created_date: awsToUnixFormat(created_date.S)
    }
}
exports.jobInfo = payload => {
    const currJobInfo = extractJobInfo(payload.dynamodb.NewImage)
    const logDate = payload.dynamodb.ApproximateCreationDateTime
    console.log("JOB INFO:", JSON.stringify(currJobInfo, null, 2))
    if (payload.eventName === NEW_RECORD_INDICATOR) { //in this case, no old image
        return { ...currJobInfo, log_date: logDate }
    }
    const prevJobInfo = extractJobInfo(payload.dynamodb.OldImage)
    console.log("PREVIOUS INFO:", JSON.stringify(prevJobInfo, null, 2))
    if (diff(prevJobInfo, currJobInfo)) {
        return { ...currBasicInfo, log_date: logDate }
    }
}

const extractJobRunInfo = body => {
    const {
        id, job_id, start_time, end_time, job_status
    } = body
    return {
        job_run_id: id.S,
        job_id: job_id.S,
        start_time: awsToUnixFormat(start_time.S),
        end_time: end_time?.S ? awsToUnixFormat(end_time.S) : null,
        job_status: job_status.S
    }
}
exports.completedJobInfo = payload => {
    if (!payload.dynamodb.NewImage.end_time?.S) {
        return //only get completed jobs
    }
    const currJobRunInfo = extractJobRunInfo(payload.dynamodb.NewImage)
    const logDate = payload.dynamodb.ApproximateCreationDateTime
    console.log("JOB RUN INFO:", JSON.stringify(currJobRunInfo, null, 2))
    if (payload.eventName === NEW_RECORD_INDICATOR) { //in this case, no old image
        return { ...currJobRunInfo, log_date: logDate }
    }
    const prevJobRunInfo = extractJobRunInfo(payload.dynamodb.OldImage)
    console.log("PREVIOUS INFO:", JSON.stringify(prevJobRunInfo, null, 2))
    if (diff(prevJobRunInfo, currJobRunInfo)) { //this shouldnt happen, but if it does....
        return { ...currJobRunInfo, log_date: logDate }
    }
}


exports.eventsJobInfo = payload => {
    const currJobRunInfo = extractJobRunInfo(payload.dynamodb.NewImage)
    const logDate = payload.dynamodb.ApproximateCreationDateTime
    console.log("JOB RUN INFO:", JSON.stringify(currJobRunInfo, null, 2))
    if (payload.eventName === NEW_RECORD_INDICATOR) { //in this case, no old image
        return { ...currJobRunInfo, log_date: logDate }
    }
    const prevJobRunInfo = extractJobRunInfo(payload.dynamodb.OldImage)
    console.log("PREVIOUS INFO:", JSON.stringify(prevJobRunInfo, null, 2))
    if (diff(prevJobRunInfo, currJobRunInfo)) {
        return { ...currJobRunInfo, log_date: logDate }
    }
}