using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.DataAccessLayer.Repositories.Abstract;
using BiTikla.DataAccessLayer.Repositories.Concrete;
using Microsoft.Extensions.DependencyInjection;

namespace BiTikla.BusinessLayer.DependencyResolvers
{
    public static class RepositoryResolver
    {
        public static void AddRepositoryService(this IServiceCollection services)
        {
            services.AddScoped<IAppUserRepository, AppUserRepository>();
            services.AddScoped<IRestaurantRepository, RestaurantRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<ICourierRepository, CourierRepository>();
            services.AddScoped<IMenuItemRepository, MenuItemRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IAddressRepository, AddressRepository>();
        }
    }
}