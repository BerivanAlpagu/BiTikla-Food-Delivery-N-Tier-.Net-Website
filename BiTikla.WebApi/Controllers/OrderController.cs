using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiTikla.WebApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderManager _orderManager;
        private readonly IMenuItemManager _menuItemManager;
        private readonly IRestaurantManager _restaurantManager;

        public OrderController(IOrderManager orderManager, IMenuItemManager menuItemManager, IRestaurantManager restaurantManager)
        {
            _orderManager = orderManager;
            _menuItemManager = menuItemManager;
            _restaurantManager = restaurantManager;
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
            // GÜVENLİK: totalPrice'ı client'dan ALMIYORUZ. DB'deki gerçek fiyatlardan hesaplıyoruz.
            if (dto.OrderDetails == null || !dto.OrderDetails.Any())
                return BadRequest("Sipariş detayı boş olamaz.");

            decimal calculatedTotal = 0;
            foreach (var detail in dto.OrderDetails)
            {
                var menuItem = await _menuItemManager.GetByIdAsync(detail.MenuItemId);
                if (menuItem == null)
                    return BadRequest($"Menü ürünü bulunamadı (ID: {detail.MenuItemId})");

                // Her ürünün gerçek birim fiyatını DB'den alıyoruz, client'ın gönderdiğini değil
                detail.UnitPrice = menuItem.Price;
                calculatedTotal += menuItem.Price * detail.Quantity;
            }

            // GÜVENLİK: Minimum sepet tutarı kontrolü (backend'de de yapılıyor)
            var restaurant = await _restaurantManager.GetByIdAsync(dto.RestaurantId);
            if (restaurant != null && calculatedTotal < restaurant.MinOrderPrice)
                return BadRequest($"Minimum sipariş tutarı {restaurant.MinOrderPrice:F2}₺. Sepetinizdeki tutar: {calculatedTotal:F2}₺");

            dto.TotalPrice = calculatedTotal;

            await _orderManager.CreateAsync(dto);
            return Ok(new { id = dto.Id, message = "Sipariş oluşturuldu", totalPrice = calculatedTotal });
        }

        [HttpPut]
        public async Task<IActionResult> Update(OrderDto dto)
        {
            await _orderManager.UpdateAsync(dto);
            return Ok("Sipariş güncellendi");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _orderManager.GetByIdAsync(id);
            if (order == null) return NotFound("Sipariş bulunamadı");
            
            await _orderManager.UpdateStatusAsync(id, dto.Status);
            return Ok("Sipariş durumu güncellendi");
        }

        [HttpPut("{id}/assign-courier")]
        public async Task<IActionResult> AssignCourier(int id, [FromBody] AssignCourierDto dto)
        {
            var order = await _orderManager.GetByIdAsync(id);
            if (order == null) return NotFound("Sipariş bulunamadı");
            
            await _orderManager.AssignCourierAsync(id, dto.CourierId);
            return Ok("Siparişe kurye başarıyla atandı");
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
