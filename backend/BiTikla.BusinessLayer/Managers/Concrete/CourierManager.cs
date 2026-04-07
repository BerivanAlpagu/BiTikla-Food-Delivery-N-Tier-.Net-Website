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
    public class CourierManager : BaseManager<CourierDto, Courier>, ICourierManager
    {
        public CourierManager(ICourierRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public async Task<List<CourierDto>> GetAvailableAsync()
        {
            var entities = await Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync(_repository.Where(x => x.IsAvailable && x.Status != BiTikla.EntityLayer.Enums.DataStatus.Deleted));
            return _mapper.Map<List<CourierDto>>(entities);
        }
    }
}
