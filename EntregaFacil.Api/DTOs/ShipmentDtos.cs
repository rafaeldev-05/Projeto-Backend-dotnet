namespace EntregaFacil.Api.DTOs;

public record ShipOrderRequest(
    int CarrierId,
    string TrackingCode,
    DateTime ShippingDate);

public record ShipmentResponse(
    int Id,
    int OrderId,
    int CarrierId,
    string CarrierName,
    string TrackingCode,
    DateTime ShippingDate,
    DateTime? DeliveryDate);
