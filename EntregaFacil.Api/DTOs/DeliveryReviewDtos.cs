namespace EntregaFacil.Api.DTOs;

public record CreateDeliveryReviewRequest(
    int Rating,
    string? Comment);

public record DeliveryReviewResponse(
    int Id,
    int OrderId,
    int Rating,
    string? Comment,
    DateTime CreatedAt);
