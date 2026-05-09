namespace EntregaFacil.Api.DTOs;

public record CreateCarrierRequest(
    string Name,
    string Cnpj,
    string? Phone);

public record CarrierResponse(
    int Id,
    string Name,
    string Cnpj,
    string? Phone);
