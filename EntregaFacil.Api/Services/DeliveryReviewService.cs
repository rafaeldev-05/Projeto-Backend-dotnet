using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Enums;
using EntregaFacil.Api.Models;
using EntregaFacil.Api.Repositories;

namespace EntregaFacil.Api.Services;

public class DeliveryReviewService(
    IOrderRepository orderRepository,
    IDeliveryReviewRepository reviewRepository)
{
    public async Task<DeliveryReviewResponse> CreateAsync(int orderId, CreateDeliveryReviewRequest request)
    {
        if (request.Rating is < 1 or > 5)
        {
            throw new InvalidOperationException("Review rating must be between 1 and 5.");
        }

        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.Status != OrderStatus.Delivered)
        {
            throw new InvalidOperationException("Delivery review can only be registered after the order is delivered.");
        }

        var existingReview = await reviewRepository.GetByOrderIdAsync(orderId);
        if (existingReview is not null)
        {
            throw new InvalidOperationException("This order already has a delivery review.");
        }

        var review = new DeliveryReview
        {
            OrderId = order.Id,
            Rating = request.Rating,
            Comment = request.Comment?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await reviewRepository.AddAsync(review);
        await reviewRepository.SaveChangesAsync();

        return ToResponse(review);
    }

    public async Task<DeliveryReviewResponse> GetByOrderIdAsync(int orderId)
    {
        _ = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        var review = await reviewRepository.GetByOrderIdAsync(orderId)
            ?? throw new KeyNotFoundException("Delivery review not found.");

        return ToResponse(review);
    }

    private static DeliveryReviewResponse ToResponse(DeliveryReview review)
    {
        return new DeliveryReviewResponse(
            review.Id,
            review.OrderId,
            review.Rating,
            review.Comment,
            review.CreatedAt);
    }
}
