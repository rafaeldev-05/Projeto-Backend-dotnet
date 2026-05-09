using EntregaFacil.Api.Data;
using EntregaFacil.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EntregaFacil.Api.Repositories;

public class DeliveryReviewRepository(EntregaFacilDbContext context) : IDeliveryReviewRepository
{
    public Task<DeliveryReview?> GetByOrderIdAsync(int orderId)
    {
        return context.DeliveryReviews.AsNoTracking().FirstOrDefaultAsync(review => review.OrderId == orderId);
    }

    public async Task AddAsync(DeliveryReview review)
    {
        await context.DeliveryReviews.AddAsync(review);
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }
}
