export const listDocuments = /* GraphQL */ `
  query ListDocuments(
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

export const getDocument = /* GraphQL */ `
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

export const searchDocuments = /* GraphQL */ `
  query SearchDocuments($query: String!) {
    searchDocuments(query: $query) {
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

export const getDocumentStats = /* GraphQL */ `
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