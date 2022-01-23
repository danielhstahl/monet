

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
