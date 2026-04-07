using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.Dtos.Concrete;

namespace BiTikla.BusinessLayer.Managers.Abstract
{
    public interface IAddressManager : IManager<AddressDto>
    {
        List<AddressDto> GetByUser(int userId);
    }
}
