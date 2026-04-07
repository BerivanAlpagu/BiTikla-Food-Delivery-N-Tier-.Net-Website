using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.Managers.Abstract;
using BiTikla.BusinessLayer.Managers.Concrete;
using Microsoft.Extensions.DependencyInjection;

namespace BiTikla.BusinessLayer.DependencyResolvers
{
    public static class ManagerResolver
    {
        public static void AddManagerService(this IServiceCollection services)
        {
            services.AddScoped<IAppUserManager, AppUserManager>();
            services.AddScoped<IRestaurantManager, RestaurantManager>();
            services.AddScoped<IOrderManager, OrderManager>();
            services.AddScoped<ICourierManager, CourierManager>();
            services.AddScoped<IMenuItemManager, MenuItemManager>();
            services.AddScoped<ICategoryManager, CategoryManager>();
            services.AddScoped<IAddressManager, AddressManager>();
        }
    }
}
