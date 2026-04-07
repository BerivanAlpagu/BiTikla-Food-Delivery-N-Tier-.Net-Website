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
    public class AddressConfiguration : BaseConfiguration<Address>
    {
        public override void Configure(EntityTypeBuilder<Address> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.Title).IsRequired().HasMaxLength(50);
            builder.Property(x => x.FullAddress).IsRequired();
            builder.Property(x => x.City).IsRequired().HasMaxLength(50);
        }
    }
}
