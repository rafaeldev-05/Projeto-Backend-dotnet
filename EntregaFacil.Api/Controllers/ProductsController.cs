using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace EntregaFacil.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(ProductService productService) : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductResponse>>> GetAll()
    {
        return Ok(await productService.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductResponse>> GetById(int id)
    {
        try
        {
            return Ok(await productService.GetByIdAsync(id));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponse>> Create(CreateProductRequest request)
    {
        try
        {
            var product = await productService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductResponse>> Update(int id, UpdateProductRequest request)
    {
        try
        {
            return Ok(await productService.UpdateAsync(id, request));
        }
        catch (Exception exception)
        {
            return HandleException(exception);
        }
    }
}
