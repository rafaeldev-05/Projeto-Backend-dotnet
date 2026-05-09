namespace EntregaFacil.Api.DTOs;

public record CreateProductRequest(
    string Code,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity);

public record UpdateProductRequest(
    string Code,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity);

public record ProductResponse(
    int Id,
    string Code,
    string Name,
    string? Description,
    decimal Price,
    int StockQuantity);
