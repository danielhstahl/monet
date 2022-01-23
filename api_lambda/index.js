// Load the AWS SDK for Node.js
const AWS = require('aws-sdk')
const region = process.env.REGION;
AWS.config.update({ region })
const AWSAppSyncClient = require("aws-appsync").default;
const { AUTH_TYPE } = require("aws-appsync");



let dynamoDbClient
const makeDynamoClient = () => {
    dynamoDbClient = new AWS.DynamoDB.DocumentClient({
        region, apiVersion: '2012-08-10'
    })
    return dynamoDbClient
}

const appsyncUrl = process.env.GRAPHQL_API_ENDPOINT;
let appSyncClient
const makeAppSyncClient = () => {
    appSyncClient = new AWSAppSyncClient({
        url: appsyncUrl,
        region,
        auth: {
            type: AUTH_TYPE.AWS_IAM,
            credentials: AWS.config.credentials
        },
        disableOffline: true
    });
}
const handleError = error => {
    console.error(e)
    return {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE,POST,GET"
        },
        body: JSON.stringify({ error: e.message })
    }
}
exports.createProject = async (event, context) => {
    const asc = appSyncClient || makeAppSyncClient()
    try {
        const result = createProject(asc, event)
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE,POST,GET"
            },
            body: JSON.stringify(result),
        };
        return response
    }
    catch (e) {
        return handleError(e)
    }
}

exports.createJob = async (event, context) => {
    const asc = appSyncClient || makeAppSyncClient()
    try {
        const result = createJob(asc, event)
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE,POST,GET"
            },
            body: JSON.stringify(result),
        };
        return response
    }
    catch (e) {
        return handleError(e)
    }
}
exports.startJob = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    const asc = appSyncClient || makeAppSyncClient()
    try {
        const result = startJob(asc, ddb, event)
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE,POST,GET"
            },
            body: JSON.stringify(result),
        };
        return response
    }
    catch (e) {
        return handleError(e)
    }
}

exports.finishJob = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    const asc = appSyncClient || makeAppSyncClient()
    try {
        const result = finishJob(asc, ddb, event)
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE,POST,GET"
            },
            body: JSON.stringify(result),
        };
        return response
    }
    catch (e) {
        return handleError(e)
    }
}

exports.getJobs = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    try {
        const result = getJobs(ddb, event)
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE,POST,GET"
            },
            body: JSON.stringify(result),
        };
        return response
    }
    catch (e) {
        return handleError(e)
    }
}
exports.getJobRun = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    try {
        const result = getJobRun(ddb, event)
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE,POST,GET"
            },
            body: JSON.stringify(result),
        };
        return response
    }
    catch (e) {
        return handleError(e)
    }
}

