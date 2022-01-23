//EVERYTHING is UTC
const unixToParquetFormat = (unixDate) => {
    //const iso = new Date(unixDate).toISOString()
    //return iso.substr(0, iso.lastIndexOf(".")) //remove .fffz at end
    return unixDate //turns out s3 needs raw UNIX time despite the docs, see https://stackoverflow.com/a/57238185/5673118
}
const getNow = () => {
    return unixToParquetFormat(Date.now())
}
const NUM_MS_IN_DAY = 86400000
//converts to end of day (UTC)
const convertDateToTimestamp = (dateAsStr) => {
    const unixDate = Date.parse(dateAsStr)
    return unixDate + NUM_MS_IN_DAY - 1 //last ms of day
}

exports.getNow = getNow
exports.convertDateToTimestamp = convertDateToTimestamp
exports.unixToParquetFormat = unixToParquetFormat
