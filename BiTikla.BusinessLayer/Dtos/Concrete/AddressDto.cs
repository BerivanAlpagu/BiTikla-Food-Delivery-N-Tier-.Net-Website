using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.Dtos.Abstract;

namespace BiTikla.BusinessLayer.Dtos.Concrete
{
    public class AddressDto : BaseDto
    {
        public string Title { get; set; }
        public string FullAddress { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int AppUserId { get; set; }
    }
}
