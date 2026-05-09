using EntregaFacil.Api.Enums;

namespace EntregaFacil.Api.DTOs;

public record CreateOrderRequest(
    string CustomerName,
    string CustomerEmail,
    List<CreateOrderItemRequest> Items);

public record CreateOrderItemRequest(
    int ProductId,
    int Quantity);

public record OrderResponse(
    int Id,
    string Number,
    DateTime OrderDate,
    decimal TotalAmount,
    OrderStatus Status,
    string CustomerName,
    string CustomerEmail,
    List<OrderItemResponse> Items);

public record OrderItemResponse(
    int Id,
    int ProductId,
    string ProductName,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice);
