namespace CCSDashboard.Models
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public DateTime? LastLoginAt { get; set; }
    }
}