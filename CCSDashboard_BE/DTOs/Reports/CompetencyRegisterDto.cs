namespace CCSDashboard.DTOs.Reports
{
    public class CompetencyRegisterDto
    {
        public string EmployeeCode { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string CompetencyArea { get; set; } = string.Empty;
        public string CertificateNumber { get; set; } = string.Empty;
        public DateOnly IssueDate { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string BatchCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
    }
}