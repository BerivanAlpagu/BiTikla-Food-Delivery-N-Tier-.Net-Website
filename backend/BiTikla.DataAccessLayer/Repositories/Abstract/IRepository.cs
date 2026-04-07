using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.EntityLayer.Models.Abstract;
using System.Linq.Expressions;

namespace BiTikla.DataAccessLayer.Repositories.Abstract
{
    public interface IRepository<T> where T : BaseEntity
    {
        // Okuma
        Task<List<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        List<T> GetActives();
        List<T> GetPassives();
        IQueryable<T> Where(Expression<Func<T, bool>> exp);

        // Yazma
        Task CreateAsync(T entity);
        Task UpdateAsync(T oldEntity, T newEntity);
        Task DeleteAsync(T entity);
        Task<int> SaveChangesAsync();
    }
}
