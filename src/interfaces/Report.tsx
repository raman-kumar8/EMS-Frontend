 export default interface Report {
  reportId: string;
  userId: string;
  reportName: string;
  generatedTime?: string;
  summary?: string;
  s3Url?: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'PENDING';
  created_at: string;
  updated_at?: string;
  reportTask?: {
    id: string;
    includedTaskNames: string[];
  };
}
