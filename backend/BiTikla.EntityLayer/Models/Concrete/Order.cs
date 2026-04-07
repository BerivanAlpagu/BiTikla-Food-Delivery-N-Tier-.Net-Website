using BiTikla.EntityLayer.Models.Abstract;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BiTikla.EntityLayer.Models.Concrete
{
    public class Order : BaseEntity
    {
        public string DeliveryAddress { get; set; }
        public decimal TotalPrice { get; set; }
        public string OrderStatus { get; set; } // Pending, Preparing, OnTheWay, Delivered
        public int AppUserId { get; set; }
        public int RestaurantId { get; set; }
        public int? CourierId { get; set; }     // Kurye atanınca dolar

        // Navigation Properties
        public virtual AppUser AppUser { get; set; }
        public virtual Restaurant Restaurant { get; set; }
        public virtual Courier Courier { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
