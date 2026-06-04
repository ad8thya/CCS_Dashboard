namespace CCSDashboard.Models
{
    public class Batch
    {
        public int Id { get; set; }
        public string BatchCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Trainer { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;

        // Navigation
        public ICollection<Certificate> Certificates { get; set; } = [];
    }
}