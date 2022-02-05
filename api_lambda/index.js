// Load the AWS SDK for Node.js
const AWS = require('aws-sdk')
global.fetch = require('node-fetch')
const {
    createJob,
    createProject,
    startJob,
    finishJob,
    getJobRun,
    getJobs
} = require('./logic/api_lambdas')


const AWSAppSyncClient = require("aws-appsync").default;
const { AUTH_TYPE } = require("aws-appsync");

let dynamoDbClient
const makeDynamoClient = () => {
    dynamoDbClient = new AWS.DynamoDB.DocumentClient({
        region: AWS.config.region, apiVersion: '2012-08-10'
    })
    return dynamoDbClient
}


let appSyncClient
const makeAppSyncClient = () => {
    appSyncClient = new AWSAppSyncClient({
        url: process.env.GRAPHQL_API_ENDPOINT,
        region: AWS.config.region,
        auth: {
            type: AUTH_TYPE.API_KEY,
            apiKey: process.env.GRAPHQL_API_KEY
            //credentials: AWS.config.credentials
        },
        disableOffline: true
    });
    return appSyncClient
}
const handleError = error => {
    console.error(error)
    return {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE,POST,GET"
        },
        body: JSON.stringify({ error: error.message })
    }
}

const handleResult = result => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE,POST,GET"
        },
        body: JSON.stringify(result),
    };
}
exports.createProject = async (event, context) => {
    const asc = appSyncClient || makeAppSyncClient()
    try {
        const body = JSON.parse(event.body)
        const result = await createProject(asc, { body })
        return handleResult(result)
    }
    catch (e) {
        return handleError(e)
    }
}

exports.createJob = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    const asc = appSyncClient || makeAppSyncClient()
    try {
        const body = JSON.parse(event.body)
        const result = await createJob(asc, ddb, { ...event, body })
        return handleResult(result)
    }
    catch (e) {
        return handleError(e)
    }
}
exports.startJob = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    const asc = appSyncClient || makeAppSyncClient()
    try {
        const result = await startJob(asc, ddb, event)
        return handleResult(result)
    }
    catch (e) {
        return handleError(e)
    }
}

exports.finishJob = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    const asc = appSyncClient || makeAppSyncClient()
    try {
        const body = JSON.parse(event.body)
        const result = await finishJob(asc, ddb, { ...event, body })
        return handleResult(result)
    }
    catch (e) {
        return handleError(e)
    }
}

exports.getJobs = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    try {
        const result = await getJobs(ddb, event)
        return handleResult(result)
    }
    catch (e) {
        return handleError(e)
    }
}
exports.getJobRun = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    try {
        const result = await getJobRun(ddb, event)
        return handleResult(result)
    }
    catch (e) {
        return handleError(e)
    }
}

