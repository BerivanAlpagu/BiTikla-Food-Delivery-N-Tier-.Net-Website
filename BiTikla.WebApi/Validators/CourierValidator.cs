using BiTikla.BusinessLayer.Dtos.Concrete;
using FluentValidation;

namespace BiTikla.WebApi.Validators
{
    public class CourierValidator : AbstractValidator<CourierDto>
    {
        public CourierValidator()
        {
            RuleFor(x => x.FullName).NotEmpty().WithMessage("Kurye adı boş bırakılamaz.");
            RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("Telefon numarası zorunludur.");
        }
    }
}
