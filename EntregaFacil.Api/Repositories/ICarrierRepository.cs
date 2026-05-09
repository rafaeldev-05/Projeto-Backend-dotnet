using EntregaFacil.Api.Models;

namespace EntregaFacil.Api.Repositories;

public interface ICarrierRepository
{
    Task<List<Carrier>> GetAllAsync();
    Task<Carrier?> GetByIdAsync(int id);
    Task AddAsync(Carrier carrier);
    Task SaveChangesAsync();
}
