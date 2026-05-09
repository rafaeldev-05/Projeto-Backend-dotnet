using EntregaFacil.Api.Data;
using EntregaFacil.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EntregaFacil.Api.Repositories;

public class ProductRepository(EntregaFacilDbContext context) : IProductRepository
{
    public Task<List<Product>> GetAllAsync()
    {
        return context.Products.AsNoTracking().OrderBy(product => product.Name).ToListAsync();
    }

    public Task<Product?> GetByIdAsync(int id)
    {
        return context.Products.FirstOrDefaultAsync(product => product.Id == id);
    }

    public async Task AddAsync(Product product)
    {
        await context.Products.AddAsync(product);
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }
}
