using Database;
using Database.Models;
using DataModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using JwtRegisteredClaimNames = System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames;

namespace NotesSharingApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[Controller]")]
    public class UserProfileController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserService _userService;

        public UserProfileController(UserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpGet("")]
        public IActionResult GetUser()
        {
            try
            {
                string Id = User.FindFirstValue("id");
                if (string.IsNullOrEmpty(Id)) return Unauthorized("user not found");
                UserModel user = _userService.GetOneAsync(u => u.Id == Id).GetAwaiter().GetResult();
                if (user == null) return Unauthorized("User not found");
                return Ok(user);
            }
            catch (Exception ex)
            {
                return Unauthorized(new
                {
                    message = ex.Message,
                });
            }
        }

        [HttpPut("updateuser")]
        public IActionResult UpdateUser([FromBody] UserModel user)
        {
            try
            {
                string Id = User.FindFirstValue("id");
                if (String.IsNullOrEmpty(Id)) return Unauthorized(new { message = "invalid token" });
                UserModel _user = _userService.GetOneAsync(u => u.Id == Id).GetAwaiter().GetResult();
                if (_user == null) return Unauthorized(new { message = "User not found" });
                _user.UserName = user.UserName;
                bool result = _userService.UpdateAsync(_user.Id, _user).GetAwaiter().GetResult();
                if (!result) return BadRequest(new { message = "Server error: could'nt update user data" });
                return Ok(new
                {
                    message = "User data updated"
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }

        }

        [HttpPut("changepassword")]
        public IActionResult ChangePassword([FromBody] PasswordModel model)
        {
            try
            {
                string Id = User.FindFirstValue("id");
                if (Id == null) return Unauthorized(new { message = "Unauthorized" });

                UserModel user = _userService.GetOneAsync(u => u.Id == Id).GetAwaiter().GetResult();
                if (user == null) return Unauthorized(new { message = "User not found" });

                bool result = BCrypt.Net.BCrypt.Verify(model.Password, user.Password);
                if (result == false) return Unauthorized(new { message = "Incorrect password" });

                user.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
                result = _userService.UpdateAsync(Id, user).GetAwaiter().GetResult();
                if (!result) return BadRequest(new { message = "Server error: could'nt update user data" });
                return Ok(new
                {
                    message = "Password changed successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpPost("uploadimage")]
        public IActionResult UploadImage([FromForm] IFormFile? file)
        {
            if (file == null)
            {
                return BadRequest(new
                {
                    message = "file not found"
                });
            }



            return Ok(new
            {
                message = "successfully go file"
            });
        }
    }
}
