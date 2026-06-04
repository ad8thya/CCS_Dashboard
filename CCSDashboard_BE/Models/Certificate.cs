namespace CCSDashboard.Models
{
    public class Certificate
    {
        public int Id { get; set; }
        public string CertificateNumber { get; set; } = string.Empty;

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; } = null!;

        public int BatchId { get; set; }
        public Batch Batch { get; set; } = null!;

        public DateOnly IssueDate { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public string Status { get; set; } = string.Empty; // Active, Expired, Revoked
        public string CompetencyArea { get; set; } = string.Empty;
    }
}