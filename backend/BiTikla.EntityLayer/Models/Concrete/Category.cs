using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.EntityLayer.Models.Abstract;

namespace BiTikla.EntityLayer.Models.Concrete
{
    public class Category : BaseEntity
    {
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }
        public int RestaurantId { get; set; }

        // Navigation Properties
        public virtual Restaurant Restaurant { get; set; }
        public virtual ICollection<MenuItem> MenuItems { get; set; }
    }
}
