using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace BiTikla.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly IAddressManager _addressManager;

        public AddressController(IAddressManager addressManager)
        {
            _addressManager = addressManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var values = await _addressManager.GetAllAsync();
            return Ok(values);
        }

        [HttpGet("byuser/{userId}")]
        public IActionResult GetByUser(int userId)
        {
            var values = _addressManager.GetByUser(userId);
            return Ok(values);
        }

        [HttpPost]
        public async Task<IActionResult> Create(AddressDto dto)
        {
            await _addressManager.CreateAsync(dto);
            return Ok("Adres eklendi");
        }

        [HttpPut]
        public async Task<IActionResult> Update(AddressDto dto)
        {
            await _addressManager.UpdateAsync(dto);
            return Ok("Adres güncellendi");
        }

        [HttpPut("softdelete/{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var result = await _addressManager.SoftDeleteAsync(id);
            return Ok(result);
        }
    }
}
