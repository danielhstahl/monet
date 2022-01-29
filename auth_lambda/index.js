const AWS = require('aws-sdk')
const crypto = require('crypto')

let dynamoDbClient
const makeDynamoClient = () => {
    dynamoDbClient = new AWS.DynamoDB.DocumentClient({
        region: AWS.config.region, apiVersion: '2012-08-10'
    })
    return dynamoDbClient
}
const _getUser = (dynamoClient, hashApiKey) => {
    return dynamoClient.get({
        TableName: process.env.USER_TABLE_NAME,
        Key: {
            hash_api_key: hashApiKey
        }
    }).promise().then(data => data.Item)
}

exports.authUser = async (event, context) => {
    const ddb = dynamoDbClient || makeDynamoClient()
    const { authorizationToken: key } = event.headers
    const hash = crypto.createHash('sha256').update(key).digest('base64')
    const result = await _getUser(ddb, hash)
    if (result) {
        return true
    }
    else {
        throw new Error('Unauthorized')
    }
}

