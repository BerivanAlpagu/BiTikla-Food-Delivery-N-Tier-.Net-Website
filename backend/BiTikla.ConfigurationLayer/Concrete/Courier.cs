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
    public class CourierConfiguration : BaseConfiguration<Courier>
    {
        public override void Configure(EntityTypeBuilder<Courier> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.FullName).IsRequired().HasMaxLength(100);
            builder.Property(x => x.PhoneNumber).IsRequired().HasMaxLength(20);
            builder.Property(x => x.VehicleType).HasMaxLength(20);
        }
    }
}
