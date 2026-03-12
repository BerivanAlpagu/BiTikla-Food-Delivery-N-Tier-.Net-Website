using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.MappingProfiles;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;

namespace BiTikla.BusinessLayer.DependencyResolvers
{
    public static class MapperResolver
    {
        public static void AddMapperService(this IServiceCollection services)
        {
            services.AddSingleton(provider => new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<DtoMappingProfile>();
            }).CreateMapper());
        }
    }
}
