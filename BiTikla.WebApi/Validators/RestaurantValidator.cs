using BiTikla.BusinessLayer.Dtos.Concrete;
using FluentValidation;

namespace BiTikla.WebApi.Validators
{
    public class RestaurantValidator : AbstractValidator<RestaurantDto>
    {
        public RestaurantValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Restoran adı boş geçilemez");
            RuleFor(x => x.MinOrderPrice).GreaterThanOrEqualTo(0).WithMessage("Minimum sipariş tutarı 0'dan küçük olamaz");
            RuleFor(x => x.DeliveryFee).GreaterThanOrEqualTo(0).WithMessage("Teslimat ücreti 0'dan küçük olamaz");
        }
    }
}
