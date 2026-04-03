using AutoMapper;
using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace BiTikla.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantController : ControllerBase
    {
        private readonly IRestaurantManager _restaurantManager;
        private readonly IMenuItemManager _menuItemManager;

        public RestaurantController(IRestaurantManager restaurantManager, IMenuItemManager menuItemManager)
        {
            _restaurantManager = restaurantManager;
            _menuItemManager = menuItemManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var values = await _restaurantManager.GetAllAsync();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var value = await _restaurantManager.GetByIdAsync(id);
            if (value == null) return NotFound("Restoran bulunamadı");
            return Ok(value);
        }

        [HttpGet("actives")]
        public IActionResult GetActives()
        {
            var values = _restaurantManager.GetActives();
            return Ok(values);
        }

        [HttpPost]
        public async Task<IActionResult> Create(RestaurantDto dto)
        {
            // GÜVENLİK: minOrderPrice'ı dışarıdan kabul etmiyoruz, 0 olarak başlat
            dto.MinOrderPrice = 0;
            await _restaurantManager.CreateAsync(dto);
            return Ok("Restoran eklendi");
        }

        [HttpPut]
        public async Task<IActionResult> Update(RestaurantDto dto)
        {
            // GÜVENLİK: minOrderPrice'ı menü ürünlerinin en düşüğü fiyatından otomatik hesapla
            var menuItems = await _menuItemManager.GetByRestaurantIdAsync(dto.Id);
            if (menuItems != null && menuItems.Any())
                dto.MinOrderPrice = menuItems.Min(x => x.Price);
            else
                dto.MinOrderPrice = 0; // Henüz ürün yoksa 0

            await _restaurantManager.UpdateAsync(dto);
            return Ok("Restoran güncellendi");
        }

        [HttpPut("softdelete/{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var result = await _restaurantManager.SoftDeleteAsync(id);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> HardDelete(int id)
        {
            var result = await _restaurantManager.HardDeleteAsync(id);
            return Ok(result);
        }
    }
}
