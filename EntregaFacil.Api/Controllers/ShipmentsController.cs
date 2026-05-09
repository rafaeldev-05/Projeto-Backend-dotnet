using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EntregaFacil.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class ShipmentsController(ShipmentService shipmentService) : ApiControllerBase
{
    [HttpPost("{id:int}/ship")]
    public async Task<ActionResult<ShipmentResponse>> ShipOrder(int id, ShipOrderRequest request)
    {
        try
        {
            return Ok(await shipmentService.ShipOrderAsync(id, request));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost("{id:int}/confirm-delivery")]
    public async Task<ActionResult<ShipmentResponse>> ConfirmDelivery(int id)
    {
        try
        {
            return Ok(await shipmentService.ConfirmDeliveryAsync(id));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }
}
