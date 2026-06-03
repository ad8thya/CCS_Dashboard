using Microsoft.AspNetCore.Mvc;
using CCSDashboard.Data;
using CCSDashboard.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace CCSDashboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            ApplicationDbContext context,
            IConfiguration configuration
        )
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login(
            [FromBody] LoginRequest request
        )
        {
            var user =
                _context.Users.FirstOrDefault(
                    u =>
                        u.Username == request.Username &&
                        u.Password == request.Password
                );

            if (user == null)
            {
                return Unauthorized();
            }

            var claims = new[]
{
    new Claim(ClaimTypes.Name, user.Username),
    new Claim(ClaimTypes.Role, user.Role)
};

var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(
        _configuration["JwtSettings:Key"]!
    )
);

var credentials =
    new SigningCredentials(
        key,
        SecurityAlgorithms.HmacSha256
    );

var token = new JwtSecurityToken(
    issuer: _configuration["JwtSettings:Issuer"],
    audience: _configuration["JwtSettings:Audience"],
    claims: claims,
    expires: DateTime.Now.AddMinutes(60),
    signingCredentials: credentials
);

var tokenString =
    new JwtSecurityTokenHandler()
        .WriteToken(token);

return Ok(new
{
    token = tokenString
});
        }
    }
}