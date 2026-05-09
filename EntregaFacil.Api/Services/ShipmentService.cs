using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Enums;
using EntregaFacil.Api.Models;
using EntregaFacil.Api.Repositories;

namespace EntregaFacil.Api.Services;

public class ShipmentService(
    IOrderRepository orderRepository,
    ICarrierRepository carrierRepository,
    IShipmentRepository shipmentRepository,
    NotificationService notificationService)
{
    public async Task<ShipmentResponse> ShipOrderAsync(int orderId, ShipOrderRequest request)
    {
        if (request.CarrierId <= 0)
        {
            throw new InvalidOperationException("Carrier is required.");
        }

        if (string.IsNullOrWhiteSpace(request.TrackingCode))
        {
            throw new InvalidOperationException("Tracking code is required.");
        }

        if (request.ShippingDate == default)
        {
            throw new InvalidOperationException("Shipping date is required.");
        }

        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.Status != OrderStatus.ReadyForShipping)
        {
            throw new InvalidOperationException("Only orders ready for shipping can be shipped.");
        }

        var carrier = await carrierRepository.GetByIdAsync(request.CarrierId)
            ?? throw new InvalidOperationException("Carrier not found.");

        var existingShipment = await shipmentRepository.GetByOrderIdAsync(orderId);
        if (existingShipment is not null)
        {
            throw new InvalidOperationException("This order already has a shipment.");
        }

        var shipment = new Shipment
        {
            OrderId = order.Id,
            CarrierId = carrier.Id,
            TrackingCode = request.TrackingCode.Trim(),
            ShippingDate = request.ShippingDate
        };

        order.Status = OrderStatus.Shipped;

        await shipmentRepository.AddAsync(shipment);
        await shipmentRepository.SaveChangesAsync();
        await notificationService.NotifyOrderShippedAsync(order.CustomerEmail, shipment.TrackingCode);

        shipment.Carrier = carrier;

        return ToResponse(shipment);
    }

    public async Task<ShipmentResponse> ConfirmDeliveryAsync(int orderId)
    {
        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.Status != OrderStatus.Shipped)
        {
            throw new InvalidOperationException("Only shipped orders can have delivery confirmed.");
        }

        var shipment = await shipmentRepository.GetByOrderIdAsync(orderId)
            ?? throw new InvalidOperationException("Shipment not found for this order.");

        shipment.DeliveryDate = DateTime.UtcNow;
        order.Status = OrderStatus.Delivered;

        await shipmentRepository.SaveChangesAsync();

        return ToResponse(shipment);
    }

    private static ShipmentResponse ToResponse(Shipment shipment)
    {
        return new ShipmentResponse(
            shipment.Id,
            shipment.OrderId,
            shipment.CarrierId,
            shipment.Carrier?.Name ?? "Carrier not loaded",
            shipment.TrackingCode,
            shipment.ShippingDate,
            shipment.DeliveryDate);
    }
}
