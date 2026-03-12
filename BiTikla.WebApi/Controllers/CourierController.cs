using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace BiTikla.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourierController : ControllerBase
    {
        private readonly ICourierManager _courierManager;

        public CourierController(ICourierManager courierManager)
        {
            _courierManager = courierManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var values = await _courierManager.GetAllAsync();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var value = await _courierManager.GetByIdAsync(id);
            if (value == null) return NotFound("Kurye bulunamadı");
            return Ok(value);
        }

        [HttpGet("available")]
        public IActionResult GetAvailable()
        {
            var values = _courierManager.GetActives();
            return Ok(values);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CourierDto dto)
        {
            await _courierManager.CreateAsync(dto);
            return Ok("Kurye eklendi");
        }

        [HttpPut]
        public async Task<IActionResult> Update(CourierDto dto)
        {
            await _courierManager.UpdateAsync(dto);
            return Ok("Kurye güncellendi");
        }

        [HttpPut("softdelete/{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var result = await _courierManager.SoftDeleteAsync(id);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> HardDelete(int id)
        {
            var result = await _courierManager.HardDeleteAsync(id);
            return Ok(result);
        }
    }
}
