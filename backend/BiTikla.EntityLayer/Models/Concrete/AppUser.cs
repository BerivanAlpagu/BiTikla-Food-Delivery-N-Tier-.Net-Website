using BiTikla.EntityLayer.Models.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BiTikla.EntityLayer.Models.Concrete
{
    public class AppUser : BaseEntity
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Role { get; set; } // Customer, Admin, CourierManager

        // Navigation Properties
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Address> Addresses { get; set; }
    }
}
