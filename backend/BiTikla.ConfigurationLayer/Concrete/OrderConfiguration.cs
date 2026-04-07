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
    public class OrderConfiguration : BaseConfiguration<Order>
    {
        public override void Configure(EntityTypeBuilder<Order> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.TotalPrice).HasColumnType("numeric(18,2)");
            builder.Property(x => x.OrderStatus).IsRequired().HasMaxLength(20);
            builder.Property(x => x.DeliveryAddress).IsRequired();
        }
    }
}