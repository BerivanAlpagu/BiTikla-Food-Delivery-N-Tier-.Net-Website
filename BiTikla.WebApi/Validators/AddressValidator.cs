using BiTikla.BusinessLayer.Dtos.Concrete;
using FluentValidation;

namespace BiTikla.WebApi.Validators
{
    public class AddressValidator : AbstractValidator<AddressDto>
    {
        public AddressValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Adres başlığı zorunludur");
            RuleFor(x => x.FullAddress).NotEmpty().WithMessage("Açık adres zorunludur");
        }
    }
}
