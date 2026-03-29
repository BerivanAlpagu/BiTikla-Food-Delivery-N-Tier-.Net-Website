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

        public async Task<List<MenuItemDto>> GetByCategoryIdAsync(int categoryId)
        {
            var entities = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(_repository.Where(x => x.CategoryId == categoryId && x.Status != BiTikla.EntityLayer.Enums.DataStatus.Deleted));
            return _mapper.Map<List<MenuItemDto>>(entities);
        }

        public async Task<List<MenuItemDto>> GetByRestaurantIdAsync(int restaurantId)
        {
            var entities = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(_repository.Where(x => x.Category.RestaurantId == restaurantId && x.Status != BiTikla.EntityLayer.Enums.DataStatus.Deleted));
            return _mapper.Map<List<MenuItemDto>>(entities);
        }
    }
}