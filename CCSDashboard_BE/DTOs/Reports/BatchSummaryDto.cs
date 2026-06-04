namespace CCSDashboard.DTOs.Reports
{
    public class BatchSummaryDto
    {
        public string BatchCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Trainer { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;
        public int TotalParticipants { get; set; }
        public int ActiveCertificates { get; set; }
        public int ExpiredCertificates { get; set; }
    }
}