using EntregaFacil.Api.Models;

namespace EntregaFacil.Api.Repositories;

public interface IOrderRepository
{
    Task<List<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task<Order?> GetByIdWithItemsAsync(int id);
    Task AddAsync(Order order);
    Task SaveChangesAsync();
}
