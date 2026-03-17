using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace BiTikla.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemController : ControllerBase
    {
        private readonly IMenuItemManager _menuItemManager;

        public MenuItemController(IMenuItemManager menuItemManager)
        {
            _menuItemManager = menuItemManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var values = await _menuItemManager.GetAllAsync();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var value = await _menuItemManager.GetByIdAsync(id);
            if (value == null) return NotFound();
            return Ok(value);
        }

        [HttpGet("bycategory/{categoryId}")]
        public IActionResult GetByCategory(int categoryId)
        {
            var values = _menuItemManager.GetActives()
                .Where(x => x.CategoryId == categoryId)
                .ToList();
            return Ok(values);
        }

        [HttpGet("byrestaurant/{restaurantId}")]
        public IActionResult GetByRestaurant(int restaurantId)
        {
            var values = _menuItemManager.GetActives()
                .Where(x => x.CategoryId != 0)
                .ToList();
            return Ok(values);
        }

        [HttpPost]
        public async Task<IActionResult> Create(MenuItemDto dto)
        {
            await _menuItemManager.CreateAsync(dto);
            return Ok("Ürün eklendi");
        }

        [HttpPut]
        public async Task<IActionResult> Update(MenuItemDto dto)
        {
            await _menuItemManager.UpdateAsync(dto);
            return Ok("Ürün güncellendi");
        }

        [HttpPut("softdelete/{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var result = await _menuItemManager.SoftDeleteAsync(id);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> HardDelete(int id)
        {
            var result = await _menuItemManager.HardDeleteAsync(id);
            return Ok(result);
        }
    }
}
