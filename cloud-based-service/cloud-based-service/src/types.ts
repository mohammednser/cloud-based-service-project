export interface DocumentType {
  id: string;
  fileName: string;
  title: string;
  text: string;
  size: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  s3Key: string;
  classification: string[];
  metadata?: Record<string, any>;
}

export interface DocumentStats {
  totalCount: number;
  totalSize: number;
  averageSize: number;
  categoryDistribution: {
    [key: string]: number;
  };
  lastUpdated: string;
} 