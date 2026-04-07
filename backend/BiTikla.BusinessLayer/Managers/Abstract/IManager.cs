using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using BiTikla.BusinessLayer.Dtos.Abstract;

namespace BiTikla.BusinessLayer.Managers.Abstract
{
    public interface IManager<T> where T : BaseDto
    {
        Task<List<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        List<T> GetActives();
        List<T> GetPassives();

        Task CreateAsync(T dto);
        Task UpdateAsync(T dto);
        Task<string> SoftDeleteAsync(int id);
        Task<string> HardDeleteAsync(int id);
    }
}
