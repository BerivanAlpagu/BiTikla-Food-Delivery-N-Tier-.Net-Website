using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.EntityLayer.Models.Concrete;
using BiTiklaConfigurationLayer.Abstract;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BiTiklaConfigurationLayer.Concrete
{
    public class AppUserConfiguration : BaseConfiguration<AppUser>
    {
        public override void Configure(EntityTypeBuilder<AppUser> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.UserName).IsRequired().HasMaxLength(50);
            builder.Property(x => x.Email).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Password).IsRequired();
            builder.Property(x => x.Role).IsRequired().HasMaxLength(20);
        }
    }
}
