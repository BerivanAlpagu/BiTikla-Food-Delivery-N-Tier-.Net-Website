using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace BiTikla.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderManager _orderManager;

        public OrderController(IOrderManager orderManager)
        {
            _orderManager = orderManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var values = await _orderManager.GetAllAsync();
            return Ok(values);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var value = await _orderManager.GetByIdAsync(id);
            if (value == null) return NotFound("Sipariş bulunamadı");
            return Ok(value);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var values = await _orderManager.GetAllAsync();
            var userOrders = values.Where(x => x.AppUserId == userId).ToList();
            return Ok(userOrders);
        }

        [HttpGet("actives")]
        public IActionResult GetActives()
        {
            var values = _orderManager.GetActives();
            return Ok(values);
        }

        [HttpPost]
        public async Task<IActionResult> Create(OrderDto dto)
        {
            await _orderManager.CreateAsync(dto);
            return Ok(new { id = dto.Id, message = "Sipariş oluşturuldu" });
        }

        [HttpPut]
        public async Task<IActionResult> Update(OrderDto dto)
        {
            await _orderManager.UpdateAsync(dto);
            return Ok("Sipariş güncellendi");
        }

        [HttpPut("softdelete/{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var result = await _orderManager.SoftDeleteAsync(id);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> HardDelete(int id)
        {
            var result = await _orderManager.HardDeleteAsync(id);
            return Ok(result);
        }
    }
}
