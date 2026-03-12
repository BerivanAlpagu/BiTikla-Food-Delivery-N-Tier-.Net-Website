using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.Dtos.Abstract;

namespace BiTikla.BusinessLayer.Dtos.Concrete
{
    public class RestaurantDto : BaseDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public decimal MinOrderPrice { get; set; }
        public decimal DeliveryFee { get; set; }
        public int EstimatedDeliveryTime { get; set; }
        public double Rating { get; set; }
    }
}
