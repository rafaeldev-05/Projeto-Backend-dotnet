using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Enums;
using EntregaFacil.Api.Models;
using EntregaFacil.Api.Repositories;

namespace EntregaFacil.Api.Services;

public class DeliveryOccurrenceService(
    IOrderRepository orderRepository,
    IDeliveryOccurrenceRepository occurrenceRepository)
{
    public async Task<DeliveryOccurrenceResponse> CreateAsync(int orderId, CreateDeliveryOccurrenceRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Description))
        {
            throw new InvalidOperationException("Occurrence description is required.");
        }

        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.Status != OrderStatus.Shipped)
        {
            throw new InvalidOperationException("Occurrences can only be registered for shipped orders.");
        }

        var occurrence = new DeliveryOccurrence
        {
            OrderId = order.Id,
            Date = DateTime.UtcNow,
            Type = request.Type,
            Description = request.Description.Trim()
        };

        await occurrenceRepository.AddAsync(occurrence);
        await occurrenceRepository.SaveChangesAsync();

        return ToResponse(occurrence);
    }

    public async Task<List<DeliveryOccurrenceResponse>> GetByOrderIdAsync(int orderId)
    {
        _ = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        var occurrences = await occurrenceRepository.GetByOrderIdAsync(orderId);
        return occurrences.Select(ToResponse).ToList();
    }

    private static DeliveryOccurrenceResponse ToResponse(DeliveryOccurrence occurrence)
    {
        return new DeliveryOccurrenceResponse(
            occurrence.Id,
            occurrence.OrderId,
            occurrence.Date,
            occurrence.Type,
            occurrence.Description);
    }
}
