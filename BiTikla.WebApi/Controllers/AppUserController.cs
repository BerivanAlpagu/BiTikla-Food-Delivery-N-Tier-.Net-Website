using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using BiTikla.WebApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BiTikla.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppUserController : ControllerBase
    {

        private readonly IAppUserManager _appUserManager;
        private readonly ITokenService _tokenService;

        public AppUserController(IAppUserManager appUserManager, ITokenService tokenService)
        {
            _appUserManager = appUserManager;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var values = await _appUserManager.GetAllAsync();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var value = await _appUserManager.GetByIdAsync(id);
            if (value == null) return NotFound("Kullanıcı bulunamadı");
            return Ok(value);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var values = await _appUserManager.GetAllAsync();
            var user = values.FirstOrDefault(x => x.Email == loginDto.Email);

            // BCrypt kullanarak Hash eşleşmesi yapıyoruz
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                return Unauthorized(new { message = "Email veya şifre hatalı" });

            // Şifre doğruysa Token üret
            var tokenString = _tokenService.GenerateToken(user);
            return Ok(new { Token = tokenString, User = user });
        }

        [HttpPost]
        public async Task<IActionResult> Create(AppUserDto dto)
        {
            await _appUserManager.CreateAsync(dto);
            return Ok("Kullanıcı eklendi");
        }

        [HttpPut]
        public async Task<IActionResult> Update(AppUserDto dto)
        {
            await _appUserManager.UpdateAsync(dto);
            return Ok("Kullanıcı güncellendi");
        }

        [HttpPut("softdelete/{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var result = await _appUserManager.SoftDeleteAsync(id);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> HardDelete(int id)
        {
            var result = await _appUserManager.HardDeleteAsync(id);
            return Ok(result);
        }
    }
}
