using EntregaFacil.Api.Data;
using EntregaFacil.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EntregaFacil.Api.Repositories;

public class DeliveryOccurrenceRepository(EntregaFacilDbContext context) : IDeliveryOccurrenceRepository
{
    public Task<List<DeliveryOccurrence>> GetByOrderIdAsync(int orderId)
    {
        return context.DeliveryOccurrences
            .AsNoTracking()
            .Where(occurrence => occurrence.OrderId == orderId)
            .OrderByDescending(occurrence => occurrence.Date)
            .ToListAsync();
    }

    public async Task AddAsync(DeliveryOccurrence occurrence)
    {
        await context.DeliveryOccurrences.AddAsync(occurrence);
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }
}
