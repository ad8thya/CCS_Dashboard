using CCSDashboard.DTOs.Reports;

namespace CCSDashboard.Services
{
    public interface IReportsService
    {
        Task<IEnumerable<CompetencyRegisterDto>> GetCompetencyRegisterAsync();
        Task<IEnumerable<ActiveCertificateDto>> GetActiveCertificatesAsync();
        Task<IEnumerable<BatchSummaryDto>> GetBatchSummaryAsync();
    }
}