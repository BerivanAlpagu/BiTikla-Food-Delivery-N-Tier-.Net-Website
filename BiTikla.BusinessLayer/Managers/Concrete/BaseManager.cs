using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using BiTikla.BusinessLayer.Dtos.Abstract;
using BiTikla.BusinessLayer.Managers.Abstract;
using BiTikla.DataAccessLayer.Repositories.Abstract;
using BiTikla.EntityLayer.Enums;
using BiTikla.EntityLayer.Models.Abstract;

namespace BiTikla.BusinessLayer.Managers.Concrete
{
    public abstract class BaseManager<TDto, TEntity> : IManager<TDto>
        where TDto : BaseDto
        where TEntity : BaseEntity
    {
        private readonly IRepository<TEntity> _repository;
        protected readonly IMapper _mapper;

        protected BaseManager(IRepository<TEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<TDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<List<TDto>>(entities);
        }

        public async Task<TDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return _mapper.Map<TDto>(entity);
        }

        public List<TDto> GetActives()
        {
            var entities = _repository.GetActives();
            return _mapper.Map<List<TDto>>(entities);
        }

        public List<TDto> GetPassives()
        {
            var entities = _repository.GetPassives();
            return _mapper.Map<List<TDto>>(entities);
        }

        public async Task CreateAsync(TDto dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            entity.CreatedDate = DateTime.Now;
            entity.Status = DataStatus.Inserted;
            await _repository.CreateAsync(entity);
        }

        public async Task UpdateAsync(TDto dto)
        {
            var oldEntity = await _repository.GetByIdAsync(dto.Id);
            var newEntity = _mapper.Map<TEntity>(dto);
            newEntity.UpdatedDate = DateTime.Now;
            newEntity.Status = DataStatus.Updated;
            await _repository.UpdateAsync(oldEntity, newEntity);
        }

        public async Task<string> SoftDeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null || entity.Status == DataStatus.Deleted)
                return "Kayıt bulunamadı veya zaten pasif!";

            entity.Status = DataStatus.Deleted;
            entity.DeletedDate = DateTime.Now;
            await _repository.SaveChangesAsync();
            return $"{id} id'li kayıt pasife alındı.";
        }

        public async Task<string> HardDeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null || entity.Status != DataStatus.Deleted)
                return "Sadece pasif kayıtlar kalıcı silinebilir!";

            await _repository.DeleteAsync(entity);
            return $"{id} id'li kayıt kalıcı olarak silindi.";
        }
    }
}
