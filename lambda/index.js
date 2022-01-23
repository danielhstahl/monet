// Load the AWS SDK for Node.js
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const { getNow } = require('./logic/dates')
const {

} = require('./logic/helperFunctions')
const region = process.env.REGION;
AWS.config.update({ region })
const AWSAppSyncClient = require("aws-appsync").default;
const { AUTH_TYPE } = require("aws-appsync");
const gql = require("graphql-tag");


let dynamoDbClient
const makeClient = () => {
    dynamoDbClient = new AWS.DynamoDB.DocumentClient({
        region, apiVersion: '2012-08-10'
    })
    return dynamoDbClient
}

//const AWSAppSyncClient = require("aws-appsync").default;
const { AUTH_TYPE } = require("aws-appsync");

const appsyncUrl = process.env.GRAPHQL_API_ENDPOINT;
//const gql = require("graphql-tag");

let appSyncClient
const initializeClient = () => {
    appSyncClient = new AWSAppSyncClient({
        url: appsyncUrl,
        region,
        auth: {
            type: AUTH_TYPE.API_KEY,
            apiKey: process.env.GRAPHQL_API_KEY
            //credentials: AWS.config.credentials
        },
        disableOffline: true
    });
}


const transformWrapper = (records, fn) => {
    const results = records.map(({ recordId, data }) => {
        try {
            const dataDese = Buffer.from(data, 'base64').toString('ascii')
            console.log("BODY:", dataDese)
            const dataUncompressed = fn(JSON.parse(dataDese))
            if (!dataUncompressed) { //then no relevant changes
                console.log("DROPPED")
                return {
                    recordId,
                    result: "Dropped"
                }
            }
            console.log("RESULT:", dataUncompressed)
            const dataCompressed = Buffer.from(JSON.stringify(dataUncompressed)).toString('base64')
            return {
                recordId,
                result: "Ok",
                data: dataCompressed
            }
        }
        catch (e) {
            console.error(e)
            return {
                recordId,
                result: "ProcessingFailed"
            }
        }
    })
    return {
        records: results
    }
}
//I need multiple transformData per event to persist
//the right things...is there a way to tell which field was updated?
//I may need to get both the previous and new records and do a (deep) diff on them
exports.transformDynamo = async function (event, context) {
    console.log("EVENT:", JSON.stringify(event, null, 2))
    const { records } = event
    return transformWrapper(records, transformDynamoFunction)
}
