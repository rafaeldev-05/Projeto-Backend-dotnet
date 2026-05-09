using EntregaFacil.Api.Enums;

namespace EntregaFacil.Api.DTOs;

public record CreateDeliveryOccurrenceRequest(
    DeliveryOccurrenceType Type,
    string Description);

public record DeliveryOccurrenceResponse(
    int Id,
    int OrderId,
    DateTime Date,
    DeliveryOccurrenceType Type,
    string Description);
