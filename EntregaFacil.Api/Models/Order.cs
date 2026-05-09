using EntregaFacil.Api.Enums;

namespace EntregaFacil.Api.Models;

public class Order
{
    public int Id { get; set; }
    public string Number { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.AwaitingSeparation;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;

    public List<OrderItem> Items { get; set; } = [];
    public Shipment? Shipment { get; set; }
    public List<DeliveryOccurrence> DeliveryOccurrences { get; set; } = [];
    public DeliveryReview? DeliveryReview { get; set; }
}
