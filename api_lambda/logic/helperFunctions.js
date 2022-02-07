const gql = require('graphql-tag')

const parseResults = (operationName, data) => {
    return data[operationName]
}
const executeMutation = async (client, mutation, operationName, variables) => {
    const response = await client.mutate({
        mutation: gql(mutation),
        variables,
        fetchPolicy: "no-cache"
    });
    return parseResults(operationName, response.data)

}

module.exports = {
    executeMutation
}






