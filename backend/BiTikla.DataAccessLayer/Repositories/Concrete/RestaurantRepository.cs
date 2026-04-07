using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.DataAccessLayer.Context;
using BiTikla.DataAccessLayer.Repositories.Abstract;
using BiTikla.EntityLayer.Models.Concrete;

namespace BiTikla.DataAccessLayer.Repositories.Concrete
{
    public class RestaurantRepository : BaseRepository<Restaurant>, IRestaurantRepository
    {
        public RestaurantRepository(BiTiklaDbContext context) : base(context)
        {
        }
    }
}
