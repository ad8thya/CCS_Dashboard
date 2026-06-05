using CCSDashboard.Data;
using CCSDashboard.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
namespace CCSDashboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;
        private readonly ApplicationDbContext _context;


        public ReportsController(IReportsService reportsService, ApplicationDbContext context)
        {
            _reportsService = reportsService;
            _context = context;
        }

        [HttpGet("competency-register")]
public async Task<IActionResult> GetCompetencyRegister()
{
    var data = await _reportsService.GetCompetencyRegisterAsync();
    return Ok(data);
}

        [HttpGet("active-certificates")]
        public async Task<IActionResult> GetActiveCertificates()
        {
            var data = await _reportsService.GetActiveCertificatesAsync();
            return Ok(data);
        }

        [HttpGet("batch-summary")]
        public async Task<IActionResult> GetBatchSummary()
        {
            var data = await _reportsService.GetBatchSummaryAsync();
            return Ok(data);
        }
        
        [HttpGet("competency-register/export")]
public async Task<IActionResult> ExportCompetencyRegister()
{
    var data = await _reportsService.GetCompetencyRegisterAsync();
    var csv = new StringBuilder();
    csv.AppendLine("Staff ID,Name,Department,Designation,Certificate No,Issue Date,Expiry Date,Status,Batch,Course");

    foreach (var r in data)
    {
        csv.AppendLine(
            $"\"{r.EmployeeCode}\",\"{r.EmployeeName}\",\"{r.Department}\",\"{r.Designation}\"," +
            $"\"{r.CertificateNumber}\",\"{r.IssueDate}\",\"{r.ExpiryDate}\",\"{r.Status}\"," +
            $"\"{r.BatchCode}\",\"{r.CourseName}\""
        );
    }

    var bytes = Encoding.UTF8.GetBytes(csv.ToString());
    return File(bytes, "text/csv", $"competency-register-{DateTime.Today:yyyyMMdd}.csv");
}


        [HttpGet("active-certificates/export")]
public async Task<IActionResult> ExportActiveCertificates()
{
    var data = await _reportsService.GetActiveCertificatesAsync();
    var csv = new StringBuilder();
    csv.AppendLine("Certificate No,Staff ID,Name,Department,Competency Area,Issue Date,Expiry Date,Days To Expiry");

    foreach (var r in data)
    {
        csv.AppendLine(
            $"\"{r.CertificateNumber}\",\"{r.EmployeeCode}\",\"{r.EmployeeName}\",\"{r.Department}\"," +
            $"\"{r.CompetencyArea}\",\"{r.IssueDate}\",\"{r.ExpiryDate}\",\"{r.DaysToExpiry}\""
        );
    }

    var bytes = Encoding.UTF8.GetBytes(csv.ToString());
    return File(bytes, "text/csv", $"active-certificates-{DateTime.Today:yyyyMMdd}.csv");
}

[HttpGet("batch-summary/export")]
public async Task<IActionResult> ExportBatchSummary()
{
    var data = await _reportsService.GetBatchSummaryAsync();
    var csv = new StringBuilder();
    csv.AppendLine("Batch Code,Course Name,Start Date,End Date,Trainer,Venue,Total Participants,Active Certificates,Expired Certificates");

    foreach (var r in data)
    {
        csv.AppendLine(
            $"\"{r.BatchCode}\",\"{r.CourseName}\",\"{r.StartDate}\",\"{r.EndDate}\"," +
            $"\"{r.Trainer}\",\"{r.Venue}\",\"{r.TotalParticipants}\",\"{r.ActiveCertificates}\",\"{r.ExpiredCertificates}\""
        );
    }

    var bytes = Encoding.UTF8.GetBytes(csv.ToString());
    return File(bytes, "text/csv", $"batch-summary-{DateTime.Today:yyyyMMdd}.csv");
}

    [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var summary = new
            {
                TotalEmployees      = await _context.Employees.CountAsync(),
                TotalCertificates   = await _context.Certificates.CountAsync(),
                ActiveCertificates  = await _context.Certificates
                                        .CountAsync(c => c.Status == "Active" && c.ExpiryDate >= today),
                ExpiringIn30Days    = await _context.Certificates
                                        .CountAsync(c => c.Status == "Active"
                                            && c.ExpiryDate >= today
                                            && c.ExpiryDate <= today.AddDays(30)),
                ExpiringIn90Days    = await _context.Certificates
                                        .CountAsync(c => c.Status == "Active"
                                            && c.ExpiryDate >= today
                                            && c.ExpiryDate <= today.AddDays(90)),
                ExpiredCertificates = await _context.Certificates
                                        .CountAsync(c => c.ExpiryDate < today),
                TotalBatches        = await _context.Batches.CountAsync(),
            };

            return Ok(summary);
        }
    }
}