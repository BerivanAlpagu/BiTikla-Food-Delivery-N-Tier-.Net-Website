using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.Dtos.Abstract;

namespace BiTikla.BusinessLayer.Dtos.Concrete
{
    public class OrderDto : BaseDto
    {
        public string DeliveryAddress { get; set; }
        public decimal TotalPrice { get; set; }
        public string OrderStatus { get; set; }
        public int AppUserId { get; set; }
        public int RestaurantId { get; set; }
        public int? CourierId { get; set; }
    }
}
