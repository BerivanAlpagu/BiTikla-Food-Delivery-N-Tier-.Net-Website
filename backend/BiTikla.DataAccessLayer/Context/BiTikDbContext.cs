using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.EntityLayer.Models.Concrete;
using BiTiklaConfigurationLayer.Concrete;
using Microsoft.EntityFrameworkCore;

namespace BiTikla.DataAccessLayer.Context
{
    public class BiTiklaDbContext : DbContext
    {
        public BiTiklaDbContext(DbContextOptions<BiTiklaDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new AppUserConfiguration());
            modelBuilder.ApplyConfiguration(new RestaurantConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryConfiguration());
            modelBuilder.ApplyConfiguration(new MenuItemConfiguration());
            modelBuilder.ApplyConfiguration(new OrderConfiguration());
            modelBuilder.ApplyConfiguration(new OrderDetailConfiguration());
            modelBuilder.ApplyConfiguration(new CourierConfiguration());
            modelBuilder.ApplyConfiguration(new AddressConfiguration());
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Courier> Couriers { get; set; }
        public DbSet<Address> Addresses { get; set; }
    }
}
