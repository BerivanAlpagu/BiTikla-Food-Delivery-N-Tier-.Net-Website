using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.Dtos.Abstract;

namespace BiTikla.BusinessLayer.Dtos.Concrete
{
    public class CategoryDto : BaseDto
    {
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }
        public int RestaurantId { get; set; }
    }
}
