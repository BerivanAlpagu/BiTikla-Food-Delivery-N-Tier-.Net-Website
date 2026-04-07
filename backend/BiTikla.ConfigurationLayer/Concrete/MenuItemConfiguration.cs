using BiTikla.EntityLayer.Models.Concrete;
using BiTiklaConfigurationLayer.Abstract;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BiTiklaConfigurationLayer.Concrete
{
    public class MenuItemConfiguration : BaseConfiguration<MenuItem>
    {
        public override void Configure(EntityTypeBuilder<MenuItem> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Price).HasColumnType("numeric(18,2)");
        }
    }
}
