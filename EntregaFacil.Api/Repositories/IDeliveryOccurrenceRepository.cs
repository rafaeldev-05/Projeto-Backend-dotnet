using EntregaFacil.Api.Models;

namespace EntregaFacil.Api.Repositories;

public interface IDeliveryOccurrenceRepository
{
    Task<List<DeliveryOccurrence>> GetByOrderIdAsync(int orderId);
    Task AddAsync(DeliveryOccurrence occurrence);
    Task SaveChangesAsync();
}
