using EntregaFacil.Api.Data;
using EntregaFacil.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EntregaFacil.Api.Repositories;

public class OrderRepository(EntregaFacilDbContext context) : IOrderRepository
{
    public Task<List<Order>> GetAllAsync()
    {
        return context.Orders
            .AsNoTracking()
            .Include(order => order.Items)
            .ThenInclude(item => item.Product)
            .OrderByDescending(order => order.OrderDate)
            .ToListAsync();
    }

    public Task<Order?> GetByIdAsync(int id)
    {
        return context.Orders.FirstOrDefaultAsync(order => order.Id == id);
    }

    public Task<Order?> GetByIdWithItemsAsync(int id)
    {
        return context.Orders
            .Include(order => order.Items)
            .ThenInclude(item => item.Product)
            .FirstOrDefaultAsync(order => order.Id == id);
    }

    public async Task AddAsync(Order order)
    {
        await context.Orders.AddAsync(order);
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }
}
