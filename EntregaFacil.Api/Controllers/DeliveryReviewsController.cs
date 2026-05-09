using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EntregaFacil.Api.Controllers;

[ApiController]
[Route("api/orders/{orderId:int}/review")]
public class DeliveryReviewsController(DeliveryReviewService reviewService) : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<DeliveryReviewResponse>> GetByOrderId(int orderId)
    {
        try
        {
            return Ok(await reviewService.GetByOrderIdAsync(orderId));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost]
    public async Task<ActionResult<DeliveryReviewResponse>> Create(int orderId, CreateDeliveryReviewRequest request)
    {
        try
        {
            return Ok(await reviewService.CreateAsync(orderId, request));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }
}
