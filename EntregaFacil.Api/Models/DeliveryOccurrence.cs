using EntregaFacil.Api.Enums;

namespace EntregaFacil.Api.Models;

public class DeliveryOccurrence
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public DateTime Date { get; set; }
    public DeliveryOccurrenceType Type { get; set; }
    public string Description { get; set; } = string.Empty;

    public Order? Order { get; set; }
}
