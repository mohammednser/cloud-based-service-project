export const createDocument = /* GraphQL */ `
  mutation CreateDocument(
    $input: CreateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    createDocument(input: $input, condition: $condition) {
      id
      fileName
      title
      text
      size
      category
      createdAt
      updatedAt
      s3Key
      classification
      metadata
    }
  }
`;

export const updateDocument = /* GraphQL */ `
  mutation UpdateDocument(
    $input: UpdateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    updateDocument(input: $input, condition: $condition) {
      id
      fileName
      title
      text
      size
      category
      createdAt
      updatedAt
      s3Key
      classification
      metadata
    }
  }
`;

export const deleteDocument = /* GraphQL */ `
  mutation DeleteDocument(
    $input: DeleteDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    deleteDocument(input: $input, condition: $condition) {
      id
      fileName
      title
      text
      size
      category
      createdAt
      updatedAt
      s3Key
      classification
      metadata
    }
  }
`;

export const triggerWebCrawler = /* GraphQL */ `
  mutation TriggerWebCrawler {
    triggerWebCrawler
  }
`; 