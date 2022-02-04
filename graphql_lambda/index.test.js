const {
    _removeExisting
} = require('./index')
const { exec } = require('child_process')
const dbName = "dynamotest"
const command = `docker run -d -p 8000:8000  --rm --name ${dbName} amazon/dynamodb-local`
const AWS = require('aws-sdk')
const region = 'us-east-1'
AWS.config.update({
    region, accessKeyId: "12345",
    secretAccessKey: "12345"
});
const createDynamoClient = () => {
    const options = {
        region, apiVersion: '2012-08-10', endpoint: `http://localhost:8000`
    }
    return new AWS.DynamoDB(options)
}
const TABLE_NAME = "mytesttable"
const createTable = () => {
    const ddb = createDynamoClient()
    const params = {
        TableName: TABLE_NAME,
        KeySchema: [
            { AttributeName: "SomeKeyName", KeyType: "HASH" }
        ],
        AttributeDefinitions: [
            { AttributeName: "SomeKeyName", AttributeType: "S" },
            { AttributeName: "SomeSecondaryKeyName", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [{
            IndexName: "SomeSecondaryIndex",
            KeySchema: [
                { AttributeName: "SomeSecondaryKeyName", KeyType: "HASH" }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };
    return ddb.createTable(params).promise()
}
const createClient = () => {
    const options = {
        region, apiVersion: '2012-08-10', endpoint: `http://localhost:8000`
    }
    return new AWS.DynamoDB.DocumentClient(options)
}
beforeAll(() => {
    return new Promise((res, rej) => exec(command, e => e ? rej(e) : setTimeout(() => {
        createTable().then(res)
    }, 1000)))
})
afterAll(() => {
    return new Promise((res, rej) => exec(`docker stop ${dbName}`, e => e ? rej(e) : res()))
})


describe("removeexisting", () => {
    it("does not error on empty table", async () => {
        const ddb = createClient()
        const result = await _removeExisting(
            ddb, TABLE_NAME, "SomeKeyName", "SomeSecondaryIndex",
            "SomeSecondaryKeyName", "secondarykeyvalue"
        )
        expect(result.length).toEqual(0)
    })
    it("deletes when existing records", async () => {
        const ddb = createClient()
        await ddb.put({
            TableName: TABLE_NAME,
            Item: {
                SomeKeyName: "mykey1",
                SomeAttribute: "myattribute1",
                SomeSecondaryKeyName: "mysecondarykey1"
            }
        }).promise()
        const result = await _removeExisting(
            ddb, TABLE_NAME, "SomeKeyName", "SomeSecondaryIndex",
            "SomeSecondaryKeyName", "mysecondarykey1"
        )
        expect(result.length).toEqual(1)
        const final = await ddb.get({
            TableName: TABLE_NAME,
            Key: {
                SomeKeyName: "mykey1"
            }
        }).promise()
        expect(final.Item).not.toBeDefined()
    })
})
