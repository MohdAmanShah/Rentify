using Database;
using Database.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace NotesSharingApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class SessionController : ControllerBase
    {
        private readonly SessionService _sessionService;
        private readonly UserService _userService;

        public SessionController(SessionService sessionService, UserService userService)
        {
            _sessionService = sessionService;
            _userService = userService;
        }

        [HttpGet("deleteallsessions")]
        public IActionResult DeleteAllSessions()
        {
            _sessionService.DeleteAllAsync().Wait();
            return Ok(new
            {
                message = "All deleted"
            });

        }

        [HttpGet("getallsessions")]
        public IActionResult Get()
        {
            List<SessionModel> sessions = _sessionService.GetAllAsync().GetAwaiter().GetResult();
            return Ok(sessions);
        }

        [HttpGet("getsession/{id}")]
        public IActionResult Get(string id)
        {
            string Id = User.FindFirstValue("id");
            if (String.IsNullOrEmpty(Id)) return Unauthorized(new { message = "Invalid Token" });
            SessionModel session = _sessionService.GetOneAsync(s => s.Id == id, true).GetAwaiter().GetResult();
            return Ok(new
            {
                session = session,
                Id = Id,
            });
        }


        [HttpDelete("deletesession/{id}")]
        public IActionResult DeleteNote(string id)
        {
            try
            {
                _sessionService.DeleteAsync(id).GetAwaiter().GetResult();
                return Ok(new
                {
                    message = "Data deleted"
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


        [HttpPost("addsession")]
        public IActionResult AddSession([FromBody] SessionModel session)
        {
            string email = User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress");
            UserModel user = _userService.GetOneAsync(u => u.Email == email).GetAwaiter().GetResult();
            if (user != null)
            {
                session.OwnerId = user.Id;
            }
            _sessionService.CreateAsync(session).Wait();
            return Ok(session);
        }

        [HttpPut("updatesession")]
        public IActionResult UpdateSession([FromBody] SessionModel session)
        {
            try
            {
                string Id = User.FindFirstValue("id");
                if (String.IsNullOrEmpty(Id)) { return Unauthorized(new { message = "Invalid token" }); }
                UserModel user = _userService.GetOneAsync(u => u.Id == Id).GetAwaiter().GetResult();
                if (user == null) { return Unauthorized(new { message = "User not found" }); }
                SessionModel _session = _sessionService.GetOneAsync(s => s.Id == session.Id).GetAwaiter().GetResult();
                if (_session == null) { return BadRequest(new { message = "Session not found" }); }
                if (_session.OwnerId != Id) { return Unauthorized(new { message = "User is not authorised to edit the session." }); }
                _session.Title = session.Title;
                _session.Description = session.Description;
                _session.LastModifiedDate = DateTime.Now;
                bool result = _sessionService.UpdateAsync(_session.Id, _session).GetAwaiter().GetResult();
                if (result)
                {
                    return Ok(new
                    {
                        message = "Session updated successfully"
                    });
                }
                return BadRequest(new { message = "server error: couldn't update the session" });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }

        }

        [HttpGet("getusersessions")]
        public IActionResult getUserSessions()
        {
            string Id = User.FindFirstValue("id");
            if (Id != null)
            {
                UserModel user = _userService.GetOneAsync(u => u.Id == Id).GetAwaiter().GetResult();
                if (user != null)
                {
                    List<SessionModel> sessions = _sessionService.GetAllAsync(s => s.OwnerId == Id).GetAwaiter().GetResult();
                    return Ok(new
                    {
                        session = sessions,
                        Id = user.Id
                    });
                }
                return Unauthorized(new
                {
                    message = "User not found"
                });
            }
            return Unauthorized(
                new
                {
                    message = "Invalid token"
                });
        }

    }
}
