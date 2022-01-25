const executeMutation = async (client, mutation, operationName, variables) => {
    try {
        const response = await client.mutate({
            mutation: gql(mutation),
            variables,
            fetchPolicy: "network-only"
        });
        return parseResults(operationName, response.data);
    } catch (err) {
        console.log("Error while trying to mutate data");
        throw JSON.stringify(err);
    }
}

module.exports = {
    executeMutation
}






