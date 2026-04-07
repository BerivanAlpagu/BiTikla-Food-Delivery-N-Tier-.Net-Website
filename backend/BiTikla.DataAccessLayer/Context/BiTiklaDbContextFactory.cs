using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace BiTikla.DataAccessLayer.Context
{
    public class BiTiklaDbContextFactory : IDesignTimeDbContextFactory<BiTiklaDbContext>
    {
        public BiTiklaDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .AddUserSecrets<BiTiklaDbContextFactory>()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<BiTiklaDbContext>();
            optionsBuilder.UseNpgsql(
                configuration.GetConnectionString("BiTiklaConnection"));

            return new BiTiklaDbContext(optionsBuilder.Options);
        }
    }
}
