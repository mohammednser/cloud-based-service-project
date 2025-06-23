export const listDocuments = `
  query ListDocuments(
    $filter: DocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        text
        createdAt
        category
        fileName
        size
        language
        status
        tags
      }
      nextToken
    }
  }
`;

export const getDocument = `
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
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

export const searchDocuments = `
  query SearchDocuments(
    $filter: String!
    $limit: Int
    $nextToken: String
  ) {
    searchDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        text
        createdAt
        category
        fileName
        size
        language
        status
        tags
      }
      nextToken
    }
  }
`;

export const getDocumentStats = `
  query GetDocumentStats {
    getDocumentStats {
      totalCount
      totalSize
      averageSize
      categoryDistribution
      lastUpdated
    }
  }
`;