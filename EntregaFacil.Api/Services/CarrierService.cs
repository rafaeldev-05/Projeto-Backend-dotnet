using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Models;
using EntregaFacil.Api.Repositories;

namespace EntregaFacil.Api.Services;

public class CarrierService(ICarrierRepository carrierRepository)
{
    public async Task<List<CarrierResponse>> GetAllAsync()
    {
        var carriers = await carrierRepository.GetAllAsync();
        return carriers.Select(ToResponse).ToList();
    }

    public async Task<CarrierResponse> GetByIdAsync(int id)
    {
        var carrier = await carrierRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Carrier not found.");

        return ToResponse(carrier);
    }

    public async Task<CarrierResponse> CreateAsync(CreateCarrierRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new InvalidOperationException("Carrier name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Cnpj))
        {
            throw new InvalidOperationException("Carrier CNPJ is required.");
        }

        var carrier = new Carrier
        {
            Name = request.Name.Trim(),
            Cnpj = request.Cnpj.Trim(),
            Phone = request.Phone?.Trim()
        };

        await carrierRepository.AddAsync(carrier);
        await carrierRepository.SaveChangesAsync();

        return ToResponse(carrier);
    }

    private static CarrierResponse ToResponse(Carrier carrier)
    {
        return new CarrierResponse(carrier.Id, carrier.Name, carrier.Cnpj, carrier.Phone);
    }
}
