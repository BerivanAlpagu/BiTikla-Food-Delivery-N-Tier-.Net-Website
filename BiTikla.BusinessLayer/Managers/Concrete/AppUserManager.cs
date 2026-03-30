using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using AutoMapper;

using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using BiTikla.DataAccessLayer.Repositories.Abstract;
using BiTikla.EntityLayer.Models.Concrete;

namespace BiTikla.BusinessLayer.Managers.Concrete
{
    public class AppUserManager : BaseManager<AppUserDto, AppUser>, IAppUserManager
    {
        public AppUserManager(IAppUserRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public override async Task CreateAsync(AppUserDto dto)
        {
            var entity = _mapper.Map<AppUser>(dto);
            
            // Kullanıcının temiz şifresini alıp geri döndürülemez Hash'e çeviriyoruz
            entity.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            
            entity.CreatedDate = DateTime.UtcNow;
            entity.Status = BiTikla.EntityLayer.Enums.DataStatus.Inserted;

            await _repository.CreateAsync(entity);
            dto.Id = entity.Id;
        }
    }
}
