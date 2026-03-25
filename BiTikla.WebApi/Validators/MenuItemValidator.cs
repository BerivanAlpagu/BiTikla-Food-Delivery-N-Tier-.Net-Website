using BiTikla.BusinessLayer.Dtos.Concrete;
using FluentValidation;

namespace BiTikla.WebApi.Validators
{
    public class MenuItemValidator : AbstractValidator<MenuItemDto>
    {
        public MenuItemValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Ürün adı boş olamaz");
            RuleFor(x => x.Price).GreaterThan(0).WithMessage("Ürün fiyatı 0'dan büyük olmalıdır");
        }
    }
}
