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
    public class OrderManager : BaseManager<OrderDto, Order>, IOrderManager
    {
        private readonly IOrderRepository _orderRepository;

        public OrderManager(IOrderRepository repository, IMapper mapper)
            : base(repository, mapper)
        {
            _orderRepository = repository;
        }

        public override async Task CreateAsync(OrderDto dto)
        {
            var entity = _mapper.Map<Order>(dto);
            entity.CreatedDate = DateTime.UtcNow;
            entity.Status = BiTikla.EntityLayer.Enums.DataStatus.Inserted;

            if (entity.OrderDetails != null)
            {
                foreach (var detail in entity.OrderDetails)
                {
                    detail.CreatedDate = DateTime.UtcNow;
                    detail.Status = BiTikla.EntityLayer.Enums.DataStatus.Inserted;
                }
            }

            await _orderRepository.CreateAsync(entity);
            dto.Id = entity.Id;
        }
        public async Task UpdateStatusAsync(int orderId, string status)
        {
            var entity = await _orderRepository.GetByIdAsync(orderId);
            if (entity != null)
            {
                entity.OrderStatus = status;
                entity.UpdatedDate = DateTime.UtcNow;
                entity.Status = BiTikla.EntityLayer.Enums.DataStatus.Updated;
                await _orderRepository.SaveChangesAsync();
            }
        }
    }
}
