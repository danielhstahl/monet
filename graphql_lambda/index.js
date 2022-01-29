const AWS = require('aws-sdk')
const crypto = require('crypto')
const {
    v4: uuidv4,
} = require('uuid');
let dynamoDbClient
const makeDynamoClient = () => {
    dynamoDbClient = new AWS.DynamoDB.DocumentClient({
        region: AWS.config.region, apiVersion: '2012-08-10'
    })
    return dynamoDbClient
}
const createApiKey = (dynamoClient, hashApiKey, projectId, userId) => {
    return dynamoClient.put({
        TableName: process.env.USER_TABLE_NAME,
        Item: {
            hash_api_key: hashApiKey,
            user_id: userId,
            project_id: projectId
        }
    }).promise()
}
//invoked from appsync
exports.createApiKey = async (event, context) => {
    console.log(event)
    const ddb = dynamoDbClient || makeDynamoClient()
    try {
        const key = uuidv4()
        const { user_id, project_id } = event.arguments
        const hash = crypto.createHash('sha256').update(key).digest('base64')
        await createApiKey(ddb, hash, project_id, user_id)
        return { api_key: key }
    }
    catch (e) {
        console.error(e)
    }
}
