namespace CCSDashboard.DTOs.Reports
{
    public class ActiveCertificateDto
    {
        public string CertificateNumber { get; set; } = string.Empty;
        public string EmployeeCode { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string CompetencyArea { get; set; } = string.Empty;
        public DateOnly IssueDate { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public int DaysToExpiry { get; set; }
    }
}