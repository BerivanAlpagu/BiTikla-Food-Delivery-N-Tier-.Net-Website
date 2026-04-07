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
    public class CategoryConfiguration : BaseConfiguration<Category>
    {
        public override void Configure(EntityTypeBuilder<Category> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.CategoryName).IsRequired().HasMaxLength(50);
        }
    }
}
