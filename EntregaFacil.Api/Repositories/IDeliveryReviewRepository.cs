using EntregaFacil.Api.Models;

namespace EntregaFacil.Api.Repositories;

public interface IDeliveryReviewRepository
{
    Task<DeliveryReview?> GetByOrderIdAsync(int orderId);
    Task AddAsync(DeliveryReview review);
    Task SaveChangesAsync();
}
