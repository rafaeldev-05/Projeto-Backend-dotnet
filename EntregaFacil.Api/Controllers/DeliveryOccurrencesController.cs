using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EntregaFacil.Api.Controllers;

[ApiController]
[Route("api/orders/{orderId:int}/occurrences")]
public class DeliveryOccurrencesController(DeliveryOccurrenceService occurrenceService) : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<DeliveryOccurrenceResponse>>> GetByOrderId(int orderId)
    {
        try
        {
            return Ok(await occurrenceService.GetByOrderIdAsync(orderId));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost]
    public async Task<ActionResult<DeliveryOccurrenceResponse>> Create(int orderId, CreateDeliveryOccurrenceRequest request)
    {
        try
        {
            return Ok(await occurrenceService.CreateAsync(orderId, request));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }
}
