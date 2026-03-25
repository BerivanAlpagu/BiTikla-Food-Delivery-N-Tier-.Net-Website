using BiTikla.BusinessLayer.Dtos.Concrete;
using FluentValidation;

namespace BiTikla.WebApi.Validators
{
    public class OrderValidator : AbstractValidator<OrderDto>
    {
        public OrderValidator()
        {
            RuleFor(x => x.DeliveryAddress).NotEmpty().WithMessage("Teslimat adresi zorunludur.");
            RuleFor(x => x.TotalPrice).GreaterThan(0).WithMessage("Sipariş tutarı 0'dan büyük olmalıdır.");
            RuleFor(x => x.AppUserId).GreaterThan(0).WithMessage("Geçersiz kullanıcı numarası.");
        }
    }
}
