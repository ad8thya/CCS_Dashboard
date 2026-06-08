namespace CCSDashboard.Models
{
    public class Contractor
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<Employee> Employees { get; set; } = [];
    }
}