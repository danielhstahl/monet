const { projectInfo, jobInfo, completedJobInfo, eventsJobInfo } = require("./transforms")

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

exports.transformProject = async function (event, context) {
    console.log("EVENT:", JSON.stringify(event, null, 2))
    const { records } = event
    return transformWrapper(records, projectInfo)
}

exports.transformJob = async function (event, context) {
    console.log("EVENT:", JSON.stringify(event, null, 2))
    const { records } = event
    return transformWrapper(records, jobInfo)
}

exports.transformCompletedJob = async function (event, context) {
    console.log("EVENT:", JSON.stringify(event, null, 2))
    const { records } = event
    return transformWrapper(records, completedJobInfo)
}

exports.transformEventsJob = async function (event, context) {
    console.log("EVENT:", JSON.stringify(event, null, 2))
    const { records } = event
    return transformWrapper(records, eventsJobInfo)
}