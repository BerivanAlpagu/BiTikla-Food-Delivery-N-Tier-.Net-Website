using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.Dtos.Concrete;

namespace BiTikla.BusinessLayer.Managers.Abstract
{
    public interface IMenuItemManager : IManager<MenuItemDto>
    {
        Task<List<MenuItemDto>> GetByCategoryIdAsync(int categoryId);
        Task<List<MenuItemDto>> GetByRestaurantIdAsync(int restaurantId);
    }
}
