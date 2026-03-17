using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using BiTikla.BusinessLayer.Dtos.Concrete;
using BiTikla.BusinessLayer.Managers.Abstract;
using BiTikla.DataAccessLayer.Repositories.Abstract;
using BiTikla.EntityLayer.Models.Concrete;

namespace BiTikla.BusinessLayer.Managers.Concrete
{
    public class AddressManager : BaseManager<AddressDto, Address>, IAddressManager
    {
        private readonly IAddressRepository _addressRepository;

        public AddressManager(IAddressRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
            _addressRepository = repository;
        }

        public List<AddressDto> GetByUser(int userId)
        {
            var values = _addressRepository
                .Where(x => x.AppUserId == userId)
                .ToList();
            return _mapper.Map<List<AddressDto>>(values);
        }
    }
}
