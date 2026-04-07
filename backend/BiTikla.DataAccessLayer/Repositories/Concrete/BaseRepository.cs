using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.DataAccessLayer.Repositories.Abstract;
using BiTikla.EntityLayer.Enums;
using BiTikla.EntityLayer.Models.Abstract;
using BiTikla.DataAccessLayer.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BiTikla.DataAccessLayer.Repositories.Concrete
{
    public abstract class BaseRepository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly BiTiklaDbContext _context;
        protected readonly DbSet<T> _dbSet;

        protected BaseRepository(BiTiklaDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public List<T> GetActives()
        {
            return _dbSet
                .Where(x => x.Status != DataStatus.Deleted)
                .ToList();
        }

        public List<T> GetPassives()
        {
            return _dbSet
                .Where(x => x.Status == DataStatus.Deleted)
                .ToList();
        }

        public IQueryable<T> Where(Expression<Func<T, bool>> exp)
        {
            return _dbSet.Where(exp);
        }

        public async Task CreateAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await SaveChangesAsync();
        }

        public async Task UpdateAsync(T oldEntity, T newEntity)
        {
            _dbSet.Entry(oldEntity).CurrentValues.SetValues(newEntity);
            await SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            await SaveChangesAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
