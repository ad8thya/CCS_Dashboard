namespace CCSDashboard.Models
{
    public class Designation
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<Employee> Employees { get; set; } = [];
    }
}