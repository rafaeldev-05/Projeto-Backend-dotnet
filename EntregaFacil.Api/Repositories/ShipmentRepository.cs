using EntregaFacil.Api.Data;
using EntregaFacil.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EntregaFacil.Api.Repositories;

public class ShipmentRepository(EntregaFacilDbContext context) : IShipmentRepository
{
    public Task<Shipment?> GetByOrderIdAsync(int orderId)
    {
        return context.Shipments
            .Include(shipment => shipment.Carrier)
            .FirstOrDefaultAsync(shipment => shipment.OrderId == orderId);
    }

    public async Task AddAsync(Shipment shipment)
    {
        await context.Shipments.AddAsync(shipment);
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }
}
