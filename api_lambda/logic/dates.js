
const dateToAws = (jsDate) => {
    return new Date(jsDate).toISOString()
}

exports.dateToAws = dateToAws