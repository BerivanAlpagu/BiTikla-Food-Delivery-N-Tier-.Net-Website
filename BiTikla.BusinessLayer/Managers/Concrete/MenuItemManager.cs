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
    public class MenuItemManager : BaseManager<MenuItemDto, MenuItem>, IMenuItemManager
    {
        public MenuItemManager(IMenuItemRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }
    }
}