using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.EntityLayer.Models.Abstract;

namespace BiTikla.EntityLayer.Models.Concrete
{
    public class Address : BaseEntity
    {
        public string Title { get; set; }      // "Ev", "İş"
        public string FullAddress { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public double Latitude { get; set; }   // Leaflet harita için
        public double Longitude { get; set; }  // Leaflet harita için
        public int AppUserId { get; set; }

        // Navigation Property
        public virtual AppUser AppUser { get; set; }
    }
}
