using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Models;
using EntregaFacil.Api.Repositories;

namespace EntregaFacil.Api.Services;

public class ProductService(IProductRepository productRepository)
{
    public async Task<List<ProductResponse>> GetAllAsync()
    {
        var products = await productRepository.GetAllAsync();
        return products.Select(ToResponse).ToList();
    }

    public async Task<ProductResponse> GetByIdAsync(int id)
    {
        var product = await productRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Product not found.");

        return ToResponse(product);
    }

    public async Task<ProductResponse> CreateAsync(CreateProductRequest request)
    {
        ValidateProduct(request.Code, request.Name, request.Price, request.StockQuantity);

        var product = new Product
        {
            Code = request.Code.Trim(),
            Name = request.Name.Trim(),
            Description = request.Description?.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity
        };

        await productRepository.AddAsync(product);
        await productRepository.SaveChangesAsync();

        return ToResponse(product);
    }

    public async Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request)
    {
        ValidateProduct(request.Code, request.Name, request.Price, request.StockQuantity);

        var product = await productRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Product not found.");

        product.Code = request.Code.Trim();
        product.Name = request.Name.Trim();
        product.Description = request.Description?.Trim();
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;

        await productRepository.SaveChangesAsync();

        return ToResponse(product);
    }

    private static void ValidateProduct(string code, string name, decimal price, int stockQuantity)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            throw new InvalidOperationException("Product code is required.");
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new InvalidOperationException("Product name is required.");
        }

        if (price <= 0)
        {
            throw new InvalidOperationException("Product price must be greater than zero.");
        }

        if (stockQuantity < 0)
        {
            throw new InvalidOperationException("Product stock quantity cannot be negative.");
        }
    }

    private static ProductResponse ToResponse(Product product)
    {
        return new ProductResponse(product.Id, product.Code, product.Name, product.Description, product.Price, product.StockQuantity);
    }
}
