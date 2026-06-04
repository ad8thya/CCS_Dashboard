export interface BatchSummaryRecord {
  batchCode: string;
  courseName: string;
  startDate: string;
  endDate: string;
  trainer: string;
  venue: string;
  totalParticipants: number;
  activeCertificates: number;
  expiredCertificates: number;
}