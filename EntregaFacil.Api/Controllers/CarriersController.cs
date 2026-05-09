using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EntregaFacil.Api.Controllers;

[ApiController]
[Route("api/carriers")]
public class CarriersController(CarrierService carrierService) : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CarrierResponse>>> GetAll()
    {
        return Ok(await carrierService.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CarrierResponse>> GetById(int id)
    {
        try
        {
            return Ok(await carrierService.GetByIdAsync(id));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost]
    public async Task<ActionResult<CarrierResponse>> Create(CreateCarrierRequest request)
    {
        try
        {
            var carrier = await carrierService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = carrier.Id }, carrier);
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }
}
