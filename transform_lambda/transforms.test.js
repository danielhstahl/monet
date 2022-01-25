const { projectInfo, jobInfo, completedJobInfo, eventsJobInfo } = require("./transforms")

describe("projectInfo", () => {
    it("returns payload if new record", () => {
        const event = {
            awsRegion: 'us-east-1',
            eventID: 'someid',
            eventName: 'INSERT',
            userIdentity: null,
            recordFormat: 'application/json',
            tableName: 'subscription',
            dynamodb: {
                ApproximateCreationDateTime: 1631703176356,
                Keys: { company: { S: "mycompany" }, id: { S: "someid" } },
                NewImage: {
                    name: { S: "myproject" },
                    company: { S: "mycompany" },
                    id: { S: "someid" },
                    created_date: { S: "2022-01-25T12:02:43.303Z" }
                },
                SizeBytes: 442
            },
            eventSource: 'aws:dynamodb'
        }
        const result = projectInfo(event)
        expect(result).toEqual({
            log_date: 1631703176356,
            project_id: "someid",
            company: "mycompany",
            name: "myproject",
            created_date: 1643112163303
        })
    })
    it("returns nothing if not new", () => {
        const event = {
            awsRegion: 'us-east-1',
            eventID: 'someid',
            eventName: 'UPDATE',
            userIdentity: null,
            recordFormat: 'application/json',
            tableName: 'subscription',
            dynamodb: {
                ApproximateCreationDateTime: 1631703176356,
                Keys: { company: { S: "mycompany" }, id: { S: "someid" } },
                NewImage: {
                    name: { S: "myproject" },
                    company: { S: "mycompany" },
                    id: { S: "someid" },
                    created_date: { S: "2022-01-25T12:02:43.303Z" }
                },
                OldImage: {
                    name: { S: "myproject" },
                    company: { S: "mycompany" },
                    id: { S: "someid" },
                    created_date: { S: "2022-01-25T12:02:43.303Z" }
                },
                SizeBytes: 442
            },
            eventSource: 'aws:dynamodb'
        }
        const result = projectInfo(event)
        expect(result).toBeUndefined()
    })
})

describe("jobInfo", () => {
    it("returns payload if new record", () => {
        const event = {
            awsRegion: 'us-east-1',
            eventID: 'someid',
            eventName: 'INSERT',
            userIdentity: null,
            recordFormat: 'application/json',
            tableName: 'subscription',
            dynamodb: {
                ApproximateCreationDateTime: 1631703176356,
                Keys: { company: { S: "mycompany" }, id: { S: "someid" } },
                NewImage: {
                    name: { S: "myjob" },
                    id: { S: "myjobid" },
                    company: { S: "mycompany" },
                    project_id: { S: "someid" },
                    created_date: { S: "2022-01-25T12:02:43.303Z" }
                },
                SizeBytes: 442
            },
            eventSource: 'aws:dynamodb'
        }
        const result = jobInfo(event)
        expect(result).toEqual({
            log_date: 1631703176356,
            name: "myjob",
            project_id: "someid",
            job_id: "myjobid",
            company: "mycompany",
            created_date: 1643112163303
        })
    })
    it("returns nothing if not new", () => {
        const event = {
            awsRegion: 'us-east-1',
            eventID: 'someid',
            eventName: 'UPDATE',
            userIdentity: null,
            recordFormat: 'application/json',
            tableName: 'subscription',
            dynamodb: {
                ApproximateCreationDateTime: 1631703176356,
                Keys: { company: { S: "mycompany" }, id: { S: "someid" } },
                NewImage: {
                    name: { S: "myjob" },
                    id: { S: "myjobid" },
                    company: { S: "mycompany" },
                    project_id: { S: "someid" },
                    created_date: { S: "2022-01-25T12:02:43.303Z" }
                },
                OldImage: {
                    name: { S: "myjob" },
                    id: { S: "myjobid" },
                    company: { S: "mycompany" },
                    project_id: { S: "someid" },
                    created_date: { S: "2022-01-25T12:02:43.303Z" }
                },
                SizeBytes: 442
            },
            eventSource: 'aws:dynamodb'
        }
        const result = jobInfo(event)
        expect(result).toBeUndefined()
    })
})


describe("jobRunInfo", () => {
    it("returns payload if end time is defined", () => {
        const event = {
            awsRegion: 'us-east-1',
            eventID: 'someid',
            eventName: 'UPDATE',
            userIdentity: null,
            recordFormat: 'application/json',
            tableName: 'subscription',
            dynamodb: {
                ApproximateCreationDateTime: 1631703176356,
                Keys: { id: { S: "someid" } },
                NewImage: {
                    id: { S: "myjobrunid" },
                    job_id: { S: "myjobid" },
                    status: { S: "SUCCESS" },
                    start_time: { S: "2022-01-25T12:02:43.303Z" },
                    end_time: { S: "2022-01-25T12:02:43.303Z" },
                },
                OldImage: {
                    id: { S: "myjobrunid" },
                    job_id: { S: "myjobid" },
                    status: { S: "SUCCESS" },
                    start_time: { S: "2022-01-25T12:02:43.303Z" },
                },
                SizeBytes: 442
            },
            eventSource: 'aws:dynamodb'
        }
        const result = completedJobInfo(event)
        expect(result).toEqual({
            log_date: 1631703176356,
            job_run_id: "myjobrunid",
            job_id: "myjobid",
            status: "SUCCESS",
            start_time: 1643112163303,
            end_time: 1643112163303
        })
    })
    it("returns nothing if end time is not defined", () => {
        const event = {
            awsRegion: 'us-east-1',
            eventID: 'someid',
            eventName: 'UPDATE',
            userIdentity: null,
            recordFormat: 'application/json',
            tableName: 'subscription',
            dynamodb: {
                ApproximateCreationDateTime: 1631703176356,
                Keys: { id: { S: "someid" } },
                NewImage: {
                    id: { S: "myjobrunid" },
                    job_id: { S: "myjobid" },
                    status: { S: "SUCCESS" },
                    start_time: { S: "2022-01-25T12:02:43.303Z" },
                },
                OldImage: {
                    id: { S: "myjobrunid" },
                    job_id: { S: "myjobid" },
                    status: { S: "SUCCESS" },
                    start_time: { S: "2022-01-25T12:02:43.303Z" },
                },
                SizeBytes: 442
            },
            eventSource: 'aws:dynamodb'
        }
        const result = completedJobInfo(event)
        expect(result).toBeUndefined()
    })
})

describe("jobRunEvents", () => {
    it("returns payload ", () => {
        const event = {
            awsRegion: 'us-east-1',
            eventID: 'someid',
            eventName: 'INSERT',
            userIdentity: null,
            recordFormat: 'application/json',
            tableName: 'subscription',
            dynamodb: {
                ApproximateCreationDateTime: 1631703176356,
                Keys: { id: { S: "someid" } },
                NewImage: {
                    id: { S: "myjobrunid" },
                    job_id: { S: "myjobid" },
                    status: { S: "SUCCESS" },
                    start_time: { S: "2022-01-25T12:02:43.303Z" },
                    end_time: { S: "2022-01-25T12:02:43.303Z" },
                },
                SizeBytes: 442
            },
            eventSource: 'aws:dynamodb'
        }
        const result = eventsJobInfo(event)
        expect(result).toEqual({
            log_date: 1631703176356,
            job_run_id: "myjobrunid",
            job_id: "myjobid",
            status: "SUCCESS",
            start_time: 1643112163303,
            end_time: 1643112163303
        })
    })
    it("returns payload if end time is undefined", () => {
        const event = {
            awsRegion: 'us-east-1',
            eventID: 'someid',
            eventName: 'INSERT',
            userIdentity: null,
            recordFormat: 'application/json',
            tableName: 'subscription',
            dynamodb: {
                ApproximateCreationDateTime: 1631703176356,
                Keys: { id: { S: "someid" } },
                NewImage: {
                    id: { S: "myjobrunid" },
                    job_id: { S: "myjobid" },
                    status: { S: "SUCCESS" },
                    start_time: { S: "2022-01-25T12:02:43.303Z" }
                },
                SizeBytes: 442
            },
            eventSource: 'aws:dynamodb'
        }
        const result = eventsJobInfo(event)
        expect(result).toEqual({
            log_date: 1631703176356,
            job_run_id: "myjobrunid",
            job_id: "myjobid",
            status: "SUCCESS",
            start_time: 1643112163303,
            end_time: null
        })
    })
    it("returns nothing if no diffs", () => {
        const event = {
            awsRegion: 'us-east-1',
            eventID: 'someid',
            eventName: 'UPDATE',
            userIdentity: null,
            recordFormat: 'application/json',
            tableName: 'subscription',
            dynamodb: {
                ApproximateCreationDateTime: 1631703176356,
                Keys: { company: { S: "mycompany" }, id: { S: "someid" } },
                NewImage: {
                    id: { S: "myjobrunid" },
                    job_id: { S: "myjobid" },
                    status: { S: "SUCCESS" },
                    start_time: { S: "2022-01-25T12:02:43.303Z" },
                    end_time: { S: "2022-01-25T12:02:43.303Z" },
                },
                OldImage: {
                    id: { S: "myjobrunid" },
                    job_id: { S: "myjobid" },
                    status: { S: "SUCCESS" },
                    start_time: { S: "2022-01-25T12:02:43.303Z" },
                    end_time: { S: "2022-01-25T12:02:43.303Z" },
                },
                SizeBytes: 442
            },
            eventSource: 'aws:dynamodb'
        }
        const result = eventsJobInfo(event)
        expect(result).toBeUndefined()
    })
})