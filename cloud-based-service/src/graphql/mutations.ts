export const createDocument = /* GraphQL */ `
  mutation CreateDocument(
    $input: CreateDocumentInput!
  ) {
    createDocument(input: $input) {
      id
      title
      content
      fileName
      size
      s3Key
      category
      language
      status
      createdAt
      tags
    }
  }
`;

export const updateDocument = /* GraphQL */ `
  mutation UpdateDocument(
    $input: UpdateDocumentInput!
  ) {
    updateDocument(input: $input) {
      id
      title
      content
      fileName
      size
      s3Key
      category
      language
      status
      createdAt
      tags
    }
  }
`;

export const deleteDocument = /* GraphQL */ `
  mutation DeleteDocument(
    $input: DeleteDocumentInput!
  ) {
    deleteDocument(input: $input) {
      id
      title
      createdAt
    }
  }
`;

export const triggerWebCrawler = /* GraphQL */ `
  mutation TriggerWebCrawler {
    triggerWebCrawler
  }
`; 