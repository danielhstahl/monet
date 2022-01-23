const createCompanyFile = /* GraphQL */ `
  mutation CreateCompanyFile(
    $input: CreateCompanyFileInput!
    $condition: ModelCompanyFileConditionInput
  ) {
    createCompanyFile(input: $input, condition: $condition) {
      id
      name
      owner
      displayName
      key
      mimeType
      displayPath
      status
      group
      bucket
      env
      createdAt
      updatedAt
    }
  }
`;