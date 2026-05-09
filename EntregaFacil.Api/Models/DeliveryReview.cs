namespace EntregaFacil.Api.Models;

public class DeliveryReview
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }

    public Order? Order { get; set; }
}
