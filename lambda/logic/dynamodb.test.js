const {
    parseSubscriptionCreate,
    parseSubscriptionTerminate, parseSubscriptionRenew, parseGetItem,
    parseSubscriptionPay,
    parseSubscriptionCharge, parseQueryCompany
} = require('./helperFunctions')
const { getNow } = require('./dates')
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
const TABLE_NAME = "subscription"
const createTable = () => {
    const ddb = createDynamoClient()
    const params = {
        TableName: TABLE_NAME,
        KeySchema: [
            { AttributeName: "CompanyName", KeyType: "HASH" },  //Partition key
            { AttributeName: "SubId", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "CompanyName", AttributeType: "S" },
            { AttributeName: "SubId", AttributeType: "S" },
        ],
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


describe("createSub", () => {
    it("creates subscription", async () => {
        const ddb = createClient()
        const subId = "subId1"
        const contractId = "contractId"
        const subName = "someName"
        const companyName = "somecompany"
        const contractualPaymentDates = ["2020-05-05"]
        const contractPrices = { "item1": { "4": 3, "6": 2.5 } }
        const result = await ddb.put(parseSubscriptionCreate(
            TABLE_NAME,
            subId, companyName, contractId, subName,
            contractualPaymentDates, contractPrices, getNow()
        )).promise()
        expect(result).toBeDefined()
    })
})

describe("renewSub", () => {
    it("renews subscription", async () => {
        const ddb = createClient()
        const subId = "subId2"
        const contractId = "contractId"
        const subName = "someName"
        const companyName = "somecompany"
        const contractualPaymentDates = ["2020-05-05"]
        const contractPrices = { "item1": { "4": 3, "6": 2.5 } }
        await ddb.put(parseSubscriptionCreate(
            TABLE_NAME, subId, companyName, contractId, subName,
            contractualPaymentDates, contractPrices, getNow()
        )).promise()

        const prev = await ddb.get(parseGetItem(TABLE_NAME, subId, companyName)).promise()
        console.log("Record:", JSON.stringify(prev, null, 2))
        const result = await ddb.update(parseSubscriptionRenew(
            TABLE_NAME,
            subId,
            companyName,
            contractId,
            contractualPaymentDates,
            contractPrices,
            prev.Item,
            getNow()
        )).promise()
        expect(result).toBeDefined()
    })
})


describe("terminateSub", () => {
    it("terminates subscription", async () => {
        const ddb = createClient()
        const subId = "subId3"
        const contractId = "contractId"
        const subName = "someName"
        const companyName = "somecompany"
        const contractualPaymentDates = ["2020-05-05"]
        const contractPrices = { "item1": { "4": 3, "6": 2.5 } }
        await ddb.put(parseSubscriptionCreate(
            TABLE_NAME,
            subId, companyName, contractId, subName,
            contractualPaymentDates, contractPrices, getNow()
        )).promise()

        const result = ddb.update(parseSubscriptionTerminate(TABLE_NAME, subId, companyName, getNow())).promise()
        expect(result).toBeDefined()
    })
})

describe("paySub", () => {
    it("pay subscription", async () => {
        const ddb = createClient()
        const subId = "subId4"
        const contractId = "contractId"
        const subName = "someName"
        const companyName = "somecompany"
        const contractualPaymentDates = ["2020-05-05"]
        const contractPrices = { "item1": { "4": 3, "6": 2.5 } }
        await ddb.put(parseSubscriptionCreate(
            TABLE_NAME,
            subId, companyName, contractId, subName,
            contractualPaymentDates, contractPrices, getNow()
        )).promise()
        const prev = await ddb.get(parseGetItem(TABLE_NAME, subId, companyName)).promise()
        console.log("Record:", JSON.stringify(prev, null, 2))
        const payment = 500
        const paymentDate = "2020-06-06"
        const result = ddb.update(parseSubscriptionPay(TABLE_NAME, subId, companyName, payment, paymentDate, prev.Item)).promise()
        expect(result).toBeDefined()
    })
})

describe("chargeSubSub", () => {
    it("charge subscription", async () => {
        const ddb = createClient()
        const subId = "subId4"
        const contractId = "contractId"
        const subName = "someName"
        const companyName = "somecompany"
        const contractualPaymentDates = ["2020-05-05"]
        const contractPrices = { "item1": { "4": 3, "6": 2.5 } }
        await ddb.put(parseSubscriptionCreate(
            TABLE_NAME,
            subId, companyName, contractId, subName,
            contractualPaymentDates, contractPrices, getNow()
        )).promise()
        const prev = await ddb.get(parseGetItem(TABLE_NAME, subId, companyName)).promise()
        console.log("Record:", JSON.stringify(prev, null, 2))
        const result = ddb.update(parseSubscriptionCharge(TABLE_NAME, subId, companyName, { "item1": 5 }, prev.Item)).promise()
        expect(result).toBeDefined()
    })
})

describe("getSub", () => {
    it("get subscriptions", async () => {
        const ddb = createClient()
        const subId = "subId4"
        const contractId = "contractId"
        const subName = "someName"
        const companyName = "somecompany"
        const contractualPaymentDates = ["2020-05-05"]
        const contractPrices = { "item1": { "4": 3, "6": 2.5 } }
        await ddb.put(parseSubscriptionCreate(
            TABLE_NAME,
            subId, companyName, contractId, subName,
            contractualPaymentDates, contractPrices, getNow()
        )).promise()
        const result = await ddb.query(parseQueryCompany(TABLE_NAME, companyName)).promise()
        console.log("Record:", JSON.stringify(result, null, 2))
        expect(result).toBeDefined()
    })
})