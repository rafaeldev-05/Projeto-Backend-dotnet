namespace EntregaFacil.Api.Models;

public class Shipment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int CarrierId { get; set; }
    public string TrackingCode { get; set; } = string.Empty;
    public DateTime ShippingDate { get; set; }
    public DateTime? DeliveryDate { get; set; }

    public Order? Order { get; set; }
    public Carrier? Carrier { get; set; }
}
