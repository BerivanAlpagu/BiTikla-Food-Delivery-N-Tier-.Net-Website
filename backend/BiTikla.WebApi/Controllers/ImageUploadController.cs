using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace BiTikla.WebApi.Controllers
{
    // [Authorize] // Yorum satırında bırakıyorum, test etmesi kolay olsun diye. Gerçekte [Authorize(Roles="Admin")] olabilir.
    [Route("api/[controller]")]
    [ApiController]
    public class ImageUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public ImageUploadController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Dosya bulunamadı veya boyutu 0.");

            // wwwroot klasörünün tam yolu
            var webRootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            var ext = Path.GetExtension(file.FileName).ToLower();
            if (ext != ".jpg" && ext != ".jpeg" && ext != ".png")
                return BadRequest("Sadece .jpg ve .png destekleniyor.");

            // Benzersiz dosya adı oluşturuyoruz: ornek-1234.jpg
            var fileName = Guid.NewGuid().ToString("N") + ext;
            
            // wwwroot/images klasörünün varlığından emin oluyoruz
            var folderPath = Path.Combine(webRootPath, "images");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // Dosyayı diske kaydediyoruz
            var filePath = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Geriye resmin tam İnternet Yolunu (URL) döneceğiz. Örn: http://localhost:5001/images/...
            var hostUrl = $"{Request.Scheme}://{Request.Host}";
            var fileUrl = $"{hostUrl}/images/{fileName}";

            return Ok(new { Url = fileUrl });
        }
    }
}
