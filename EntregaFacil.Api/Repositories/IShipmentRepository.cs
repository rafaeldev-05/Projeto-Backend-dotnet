using EntregaFacil.Api.Models;

namespace EntregaFacil.Api.Repositories;

public interface IShipmentRepository
{
    Task<Shipment?> GetByOrderIdAsync(int orderId);
    Task AddAsync(Shipment shipment);
    Task SaveChangesAsync();
}
