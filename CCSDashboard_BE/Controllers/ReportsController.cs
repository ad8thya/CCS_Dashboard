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
        TotalDepartments  = await _context.Departments.CountAsync(d => d.IsActive),
        TotalDesignations = await _context.Designations.CountAsync(d => d.IsActive),
        TotalContractors = await _context.Contractors.CountAsync(c => c.IsActive),
        ActiveCertificates  = await _context.Certificates
                                .CountAsync(c => c.Status == "Active" && c.ExpiryDate >= today),
        ExpiringIn7Days     = await _context.Certificates
                                .CountAsync(c => c.Status == "Active"
                                    && c.ExpiryDate >= today
                                    && c.ExpiryDate <= today.AddDays(7)),
        ExpiringIn15Days    = await _context.Certificates
                                .CountAsync(c => c.Status == "Active"
                                    && c.ExpiryDate >= today
                                    && c.ExpiryDate <= today.AddDays(15)),
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

        [HttpGet("department-distribution")]
public async Task<IActionResult> GetDepartmentDistribution()
{
    var groups = await _context.Employees
    .Include(e => e.Department)
    .GroupBy(e => e.Department.Name)          // was e.Department
    .Select(g => new { Department = g.Key, Count = g.Count() })
    .OrderByDescending(g => g.Count)
    .ToListAsync();

    var total = groups.Sum(g => g.Count);

    var result = groups.Select(g => new
    {
        name = g.Department,
        count = g.Count,
        pct = total > 0 ? (int)Math.Round((double)g.Count / total * 100) : 0
    });

    return Ok(result);
}

[HttpGet("recent-activity")]
public async Task<IActionResult> GetRecentActivity()
{
    var cutoff = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7));

    // Certificates issued in last 7 days
    var recentCerts = await _context.Certificates
        .Include(c => c.Employee)
        .Include(c => c.Batch)
        .Where(c => c.IssueDate >= cutoff)
        .OrderByDescending(c => c.IssueDate)
        .Take(5)
        .Select(c => new
        {
            type = "certificate_issued",
            message = $"Certificate {c.CertificateNumber} issued to {c.Employee.Name}",
            date = c.IssueDate,
            batchCode = c.Batch.BatchCode
        })
        .ToListAsync();

    // Batches that ended in last 7 days
    var recentBatches = await _context.Batches
        .Include(b => b.Certificates)
        .Where(b => b.EndDate >= cutoff)
        .OrderByDescending(b => b.EndDate)
        .Take(3)
        .Select(b => new
        {
            type = "batch_completed",
            message = $"Batch {b.BatchCode} completed — {b.Certificates.Count} certificate(s) generated",
            date = b.EndDate,
            batchCode = b.BatchCode
        })
        .ToListAsync();

    // Certs expiring within 15 days (flagged as alerts)
    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    var expiringCount = await _context.Certificates
        .CountAsync(c => c.Status == "Active"
            && c.ExpiryDate >= today
            && c.ExpiryDate <= today.AddDays(15));

    var activity = recentCerts
        .Cast<object>()
        .Concat(recentBatches)
        .ToList();

    if (expiringCount > 0)
    {
        activity.Insert(0, new
        {
            type = "expiry_alert",
            message = $"{expiringCount} certificate(s) expiring within 15 days flagged for review",
            date = today,
            batchCode = ""
        });
    }

    return Ok(activity
        .Take(6)
        .Select((a, i) => a));
}


    }

    

    
}