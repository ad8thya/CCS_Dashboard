namespace CCSDashboard.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public int DepartmentId { get; set; }
        public Department Department { get; set; } = null!;

        public int DesignationId { get; set; }
        public Designation Designation { get; set; } = null!;

        public int? ContractorId { get; set; }        // nullable — not all staff are contractors
        public Contractor? Contractor { get; set; }

        // Convenience properties so existing code like c.Employee.Department still compiles
        public string DepartmentName => Department?.Name ?? string.Empty;
        public string DesignationName => Designation?.Name ?? string.Empty;

        public ICollection<Certificate> Certificates { get; set; } = [];
    }
}