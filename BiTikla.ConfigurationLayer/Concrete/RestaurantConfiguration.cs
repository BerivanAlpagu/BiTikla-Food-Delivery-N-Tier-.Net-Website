using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.EntityLayer.Models.Concrete;
using BiTiklaConfigurationLayer.Abstract;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BiTiklaConfigurationLayer.Concrete
{
    public class RestaurantConfiguration : BaseConfiguration<Restaurant>
    {
        public override void Configure(EntityTypeBuilder<Restaurant> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.Property(x => x.MinOrderPrice).HasColumnType("numeric(18,2)");
            builder.Property(x => x.DeliveryFee).HasColumnType("numeric(18,2)");
        }
    }
}
