namespace EntregaFacil.Api.Services;

public class NotificationService(ILogger<NotificationService> logger)
{
    public Task NotifyOrderShippedAsync(string customerEmail, string trackingCode)
    {
        logger.LogInformation(
            "Simulated notification sent to {CustomerEmail}. Tracking code: {TrackingCode}",
            customerEmail,
            trackingCode);

        return Task.CompletedTask;
    }
}
