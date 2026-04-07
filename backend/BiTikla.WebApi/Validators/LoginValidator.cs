using BiTikla.BusinessLayer.Dtos.Concrete;
using FluentValidation;

namespace BiTikla.WebApi.Validators
{
    public class LoginValidator : AbstractValidator<LoginDto>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Giriş için e-posta adresi zorunludur.")
                                 .EmailAddress().WithMessage("Lütfen geçerli bir e-posta adresi giriniz.");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Giriş için şifre zorunludur.");
        }
    }
}
