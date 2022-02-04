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

const _removeExisting = async (
    dynamoClient,
    table,
    primaryKeyName,
    secondaryIndexName,
    secondaryKeyName,
    secondaryKeyValue) => {
    const data = await dynamoClient.query({
        TableName: table,
        KeyConditionExpression: `${secondaryKeyName} = :temp`,
        ExpressionAttributeValues: {
            ':temp': secondaryKeyValue
        },
        IndexName: secondaryIndexName
    }).promise()
    return Promise.all(data.Items.map(item => dynamoClient.delete({
        TableName: table,
        Key: {
            [primaryKeyName]: item[primaryKeyName]
        }
    }).promise()))
}


const createApiKey = async (dynamoClient, hashApiKey, projectId, userId) => {
    await _removeExisting(
        dynamoClient,
        process.env.USER_TABLE_NAME,
        "hash_api_key",
        "api_index",
        "user_id",
        userId
    )
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

//for testing
exports._removeExisting = _removeExisting