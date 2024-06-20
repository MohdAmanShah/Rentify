using Database;
using Database.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JwtRegisteredClaimNames = System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames;

namespace NotesSharingApi.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class UserAccountController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserService _userService;

        public UserAccountController(UserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }
        [Authorize]
        [HttpGet("allusers")]
        public IActionResult Get()
        {
            var d = DateTime.UtcNow.AddDays(-1);
            List<UserModel> users = _userService.GetAllAsync().GetAwaiter().GetResult();
            return Ok(users);
        }


        [HttpPost("register")]
        public IActionResult RegisterUser([FromBody] UserModel User)
        {
            User.IsLoggedIn = false;
            if (String.IsNullOrEmpty(User.UserName) || String.IsNullOrWhiteSpace(User.UserName))
            {
                return BadRequest(new
                {
                    message = "Username is null"
                });
            }
            UserModel model = _userService.GetOneAsync(u => u.Email == User.Email).GetAwaiter().GetResult();
            if (model != null && model.Email == User.Email)
            {
                return BadRequest(new
                {
                    message = "Email already exists."
                });
            }

            _userService.CreateAsync(User).Wait();
            return Ok(new
            {
                Created = User
            });
        }


        [HttpPost("Login")]
        public IActionResult LoginUser([FromBody] UserModel user)
        {
            UserModel model = _userService.GetOneAsync(u => u.Email == user.Email).GetAwaiter().GetResult();
            if (model == null)
            {
                return BadRequest(new
                {
                    message = "User not found"
                });
            }
            bool result = BCrypt.Net.BCrypt.Verify(user.Password, model.Password);
            if (result == true)
            {
                if (model.IsLoggedIn == true)
                {
                    return BadRequest(new
                    {
                        message = "User already logged in"
                    });
                }
                model.IsLoggedIn = true;
                _userService.UpdateAsync(model.Id, model).Wait();
                string issuer = _configuration["Jwt:Issuer"];
                string audience = _configuration["Jwt:Audience"];
                byte[] key = Encoding.ASCII.GetBytes
                    (_configuration["Jwt:Key"]);
                SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] {
                        new Claim("id",model.Id),
                        new Claim(JwtRegisteredClaimNames.Sub, model.UserName),
                        new Claim(JwtRegisteredClaimNames.Email, model.Email),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    Issuer = issuer,
                    Audience = audience,
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
                string jwtToken = tokenHandler.WriteToken(token);
                string stringToken = tokenHandler.WriteToken(token);
                return Ok(new
                {
                    message = "Login Successful",
                    jwt = stringToken,
                });
            }
            return Unauthorized(new
            {
                message = "Password don't match"
            });
        }


        [Authorize]
        [HttpPost("logout")]
        public IActionResult LogoutUser()
        {
            string email = User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress");
            UserModel user = _userService.GetOneAsync(u => u.Email == email).GetAwaiter().GetResult();
            if (user != null)
            {
                user.IsLoggedIn = false;
                _userService.UpdateAsync(user.Id, user).Wait();
                return Ok(new
                {
                    message = "Logged out successfully"
                });
            }
            return Ok(new
            {
                message = "User not found"
            });
        }
    }
}
