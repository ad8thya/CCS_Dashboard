using CCSDashboard.Data;
using CCSDashboard.DTOs.Reports;
using Microsoft.EntityFrameworkCore;

namespace CCSDashboard.Services
{
    public class ReportsService : IReportsService
    {
        private readonly ApplicationDbContext _context;

        public ReportsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CompetencyRegisterDto>> GetCompetencyRegisterAsync()
        {
            return await _context.Certificates
                .Include(c => c.Employee)
                .Include(c => c.Batch)
                .Include(c => c.Employee).ThenInclude(e => e.Department)
                .Include(c => c.Employee).ThenInclude(e => e.Designation)
                .Include(c => c.Batch)
                .OrderBy(c => c.Employee.Department)
                .ThenBy(c => c.Employee.Name)
                .Select(c => new CompetencyRegisterDto
                {
                    EmployeeCode    = c.Employee.EmployeeCode,
                    EmployeeName    = c.Employee.Name,
                    Department      = c.Employee.Department.Name,
                    Designation     = c.Employee.Designation.Name,
                    CompetencyArea  = c.CompetencyArea,
                    CertificateNumber = c.CertificateNumber,
                    IssueDate       = c.IssueDate,
                    ExpiryDate      = c.ExpiryDate,
                    Status          = c.Status,
                    BatchCode       = c.Batch.BatchCode,
                    CourseName      = c.Batch.CourseName,
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ActiveCertificateDto>> GetActiveCertificatesAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            return await _context.Certificates
                .Include(c => c.Employee)
                .Include(c => c.Employee).ThenInclude(e => e.Department)
                .Where(c => c.Status == "Active" && c.ExpiryDate >= today)
                .OrderBy(c => c.ExpiryDate)
                .Select(c => new ActiveCertificateDto
                {
                    CertificateNumber = c.CertificateNumber,
                    EmployeeCode      = c.Employee.EmployeeCode,
                    EmployeeName      = c.Employee.Name,
                    Department        = c.Employee.Department.Name,
                    CompetencyArea    = c.CompetencyArea,
                    IssueDate         = c.IssueDate,
                    ExpiryDate        = c.ExpiryDate,
                    DaysToExpiry      = c.ExpiryDate.DayNumber - today.DayNumber,
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<BatchSummaryDto>> GetBatchSummaryAsync()
        {
            return await _context.Batches
                .Include(b => b.Certificates)
                .OrderByDescending(b => b.StartDate)
                .Select(b => new BatchSummaryDto
                {
                    BatchCode           = b.BatchCode,
                    CourseName          = b.CourseName,
                    StartDate           = b.StartDate,
                    EndDate             = b.EndDate,
                    Trainer             = b.Trainer,
                    Venue               = b.Venue,
                    TotalParticipants   = b.Certificates.Count,
                    ActiveCertificates  = b.Certificates.Count(c => c.Status == "Active"),
                    ExpiredCertificates = b.Certificates.Count(c => c.Status == "Expired"),
                })
                .ToListAsync();
        }
    }
}