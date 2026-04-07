using BiTikla.BusinessLayer.Dtos.Concrete;

namespace BiTikla.WebApi.Services
{
    public interface ITokenService
    {
        string GenerateToken(AppUserDto user);
    }
}
