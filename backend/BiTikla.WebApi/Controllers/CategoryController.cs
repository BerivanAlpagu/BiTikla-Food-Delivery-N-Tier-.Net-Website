using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace BiTikla.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryManager _categoryManager;

        public CategoryController(ICategoryManager categoryManager)
        {
            _categoryManager = categoryManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var values = await _categoryManager.GetAllAsync();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var value = await _categoryManager.GetByIdAsync(id);
            if (value == null) return NotFound("Kategori bulunamadı");
            return Ok(value);
        }

        [HttpGet("byrestaurant/{restaurantId}")]
        public async Task<IActionResult> GetByRestaurantId(int restaurantId)
        {
            var values = await _categoryManager.GetByRestaurantIdAsync(restaurantId);
            return Ok(values);
        }


        [HttpPost]
        public async Task<IActionResult> Create(CategoryDto dto)
        {
            await _categoryManager.CreateAsync(dto);
            return Ok("Kategori eklendi");
        }

        [HttpPut]
        public async Task<IActionResult> Update(CategoryDto dto)
        {
            await _categoryManager.UpdateAsync(dto);
            return Ok("Kategori güncellendi");
        }

        [HttpPut("softdelete/{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var result = await _categoryManager.SoftDeleteAsync(id);
            return Ok(result);
        }
    }
}
