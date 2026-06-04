using CCSDashboard.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CCSDashboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _reportsService;

        public ReportsController(IReportsService reportsService)
        {
            _reportsService = reportsService;
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
    }
}