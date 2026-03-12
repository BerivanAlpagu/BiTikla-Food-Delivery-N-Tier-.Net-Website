using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.Dtos.Abstract;

namespace BiTikla.BusinessLayer.Dtos.Concrete
{
    public class CourierDto : BaseDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string VehicleType { get; set; }
        public bool IsAvailable { get; set; }
        public double CurrentLatitude { get; set; }
        public double CurrentLongitude { get; set; }
    }
}
