using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
