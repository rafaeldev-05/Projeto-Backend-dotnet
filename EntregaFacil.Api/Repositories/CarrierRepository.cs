using EntregaFacil.Api.Data;
using EntregaFacil.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EntregaFacil.Api.Repositories;

public class CarrierRepository(EntregaFacilDbContext context) : ICarrierRepository
{
    public Task<List<Carrier>> GetAllAsync()
    {
        return context.Carriers.AsNoTracking().OrderBy(carrier => carrier.Name).ToListAsync();
    }

    public Task<Carrier?> GetByIdAsync(int id)
    {
        return context.Carriers.FirstOrDefaultAsync(carrier => carrier.Id == id);
    }

    public async Task AddAsync(Carrier carrier)
    {
        await context.Carriers.AddAsync(carrier);
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }
}
