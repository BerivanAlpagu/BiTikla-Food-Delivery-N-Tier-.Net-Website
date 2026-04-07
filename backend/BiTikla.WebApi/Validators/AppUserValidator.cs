using BiTikla.BusinessLayer.Dtos.Concrete;
using FluentValidation;

namespace BiTikla.WebApi.Validators
{
    public class AppUserValidator : AbstractValidator<AppUserDto>
    {
        public AppUserValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().WithMessage("Kullanıcı adı boş geçilemez");
            RuleFor(x => x.Email).NotEmpty().WithMessage("E-posta adresi boş geçilemez")
                                 .EmailAddress().WithMessage("Geçersiz e-posta formatı");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Şifre boş geçilemez")
                                    .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır");
        }
    }
}
