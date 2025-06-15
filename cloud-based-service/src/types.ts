export interface DocumentType {
  id: string;
  title: string;
  text: string; // تم التغيير من content إلى text
  createdAt: string;
  updatedAt?: string;
  category?: string;
  fileName?: string;
  size?: number;
  language?: string;
  status?: string;
  tags?: string[];
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