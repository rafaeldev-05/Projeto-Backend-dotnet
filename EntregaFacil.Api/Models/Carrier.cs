namespace EntregaFacil.Api.Models;

public class Carrier
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public string? Phone { get; set; }

    public List<Shipment> Shipments { get; set; } = [];
}
