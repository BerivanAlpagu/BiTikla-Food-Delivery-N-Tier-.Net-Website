using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.EntityLayer.Models.Abstract;

namespace BiTikla.EntityLayer.Models.Concrete
{
    public class Courier : BaseEntity
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string VehicleType { get; set; }  // Bisiklet, Motor, Araba
        public bool IsAvailable { get; set; }
        public double CurrentLatitude { get; set; }   // Anlık konum!
        public double CurrentLongitude { get; set; }  // Anlık konum!

        // Navigation Property
        public virtual ICollection<Order> Orders { get; set; }
    }
}

