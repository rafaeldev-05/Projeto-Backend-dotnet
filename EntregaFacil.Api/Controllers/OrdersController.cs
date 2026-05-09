using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EntregaFacil.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(OrderService orderService) : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<OrderResponse>>> GetAll()
    {
        return Ok(await orderService.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderResponse>> GetById(int id)
    {
        try
        {
            return Ok(await orderService.GetByIdAsync(id));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create(CreateOrderRequest request)
    {
        try
        {
            var order = await orderService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost("{id:int}/start-separation")]
    public async Task<ActionResult<OrderResponse>> StartSeparation(int id)
    {
        try
        {
            return Ok(await orderService.StartSeparationAsync(id));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost("{id:int}/confirm-separation")]
    public async Task<ActionResult<OrderResponse>> ConfirmSeparation(int id)
    {
        try
        {
            return Ok(await orderService.ConfirmSeparationAsync(id));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost("{id:int}/cancel-by-customer")]
    public async Task<ActionResult<OrderResponse>> CancelByCustomer(int id)
    {
        try
        {
            return Ok(await orderService.CancelByCustomerAsync(id));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost("{id:int}/cancel-by-stock")]
    public async Task<ActionResult<OrderResponse>> CancelByStock(int id)
    {
        try
        {
            return Ok(await orderService.CancelByStockAsync(id));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }
}
