using EntregaFacil.Api.DTOs;
using EntregaFacil.Api.Enums;
using EntregaFacil.Api.Models;
using EntregaFacil.Api.Repositories;

namespace EntregaFacil.Api.Services;

public class OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
{
    public async Task<List<OrderResponse>> GetAllAsync()
    {
        var orders = await orderRepository.GetAllAsync();
        return orders.Select(ToResponse).ToList();
    }

    public async Task<OrderResponse> GetByIdAsync(int id)
    {
        var order = await orderRepository.GetByIdWithItemsAsync(id)
            ?? throw new KeyNotFoundException("Order not found.");

        return ToResponse(order);
    }

    public async Task<OrderResponse> CreateAsync(CreateOrderRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName))
        {
            throw new InvalidOperationException("Customer name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.CustomerEmail))
        {
            throw new InvalidOperationException("Customer email is required.");
        }

        if (request.Items.Count == 0)
        {
            throw new InvalidOperationException("Order must have at least one item.");
        }

        var order = new Order
        {
            Number = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmssfff}",
            OrderDate = DateTime.UtcNow,
            Status = OrderStatus.AwaitingSeparation,
            CustomerName = request.CustomerName.Trim(),
            CustomerEmail = request.CustomerEmail.Trim()
        };

        foreach (var requestItem in request.Items)
        {
            if (requestItem.Quantity <= 0)
            {
                throw new InvalidOperationException("Item quantity must be greater than zero.");
            }

            var product = await productRepository.GetByIdAsync(requestItem.ProductId)
                ?? throw new InvalidOperationException($"Product {requestItem.ProductId} was not found.");

            var totalPrice = product.Price * requestItem.Quantity;

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = requestItem.Quantity,
                UnitPrice = product.Price,
                TotalPrice = totalPrice
            });

            order.TotalAmount += totalPrice;
        }

        await orderRepository.AddAsync(order);
        await orderRepository.SaveChangesAsync();

        return ToResponse(order);
    }

    public async Task<OrderResponse> StartSeparationAsync(int id)
    {
        var order = await GetRequiredOrderWithItemsAsync(id);

        if (order.Status != OrderStatus.AwaitingSeparation)
        {
            throw new InvalidOperationException("Only orders awaiting separation can start separation.");
        }

        order.Status = OrderStatus.InSeparation;
        await orderRepository.SaveChangesAsync();

        return ToResponse(order);
    }

    public async Task<OrderResponse> ConfirmSeparationAsync(int id)
    {
        var order = await GetRequiredOrderWithItemsAsync(id);

        if (order.Status != OrderStatus.InSeparation)
        {
            throw new InvalidOperationException("Only orders in separation can be confirmed.");
        }

        EnsureStockIsAvailable(order);

        // This is the moment when the physical stock is reserved/removed for shipment.
        foreach (var item in order.Items)
        {
            item.Product!.StockQuantity -= item.Quantity;
        }

        order.Status = OrderStatus.ReadyForShipping;
        await orderRepository.SaveChangesAsync();

        return ToResponse(order);
    }

    public async Task<OrderResponse> CancelByCustomerAsync(int id)
    {
        var order = await GetRequiredOrderWithItemsAsync(id);

        if (order.Status != OrderStatus.AwaitingSeparation)
        {
            throw new InvalidOperationException("Customer can only cancel orders while they are awaiting separation.");
        }

        order.Status = OrderStatus.Cancelled;
        await orderRepository.SaveChangesAsync();

        return ToResponse(order);
    }

    public async Task<OrderResponse> CancelByStockAsync(int id)
    {
        var order = await GetRequiredOrderWithItemsAsync(id);

        if (order.Status == OrderStatus.Delivered)
        {
            throw new InvalidOperationException("Delivered orders cannot be cancelled.");
        }

        if (order.Status != OrderStatus.InSeparation)
        {
            throw new InvalidOperationException("Stock cancellation is only allowed while the order is in separation.");
        }

        if (HasEnoughStock(order))
        {
            throw new InvalidOperationException("This order has enough stock and cannot be cancelled by stock shortage.");
        }

        order.Status = OrderStatus.Cancelled;
        await orderRepository.SaveChangesAsync();

        return ToResponse(order);
    }

    private async Task<Order> GetRequiredOrderWithItemsAsync(int id)
    {
        return await orderRepository.GetByIdWithItemsAsync(id)
            ?? throw new KeyNotFoundException("Order not found.");
    }

    private static void EnsureStockIsAvailable(Order order)
    {
        if (!HasEnoughStock(order))
        {
            throw new InvalidOperationException("Order cannot be confirmed because one or more products do not have enough stock.");
        }
    }

    private static bool HasEnoughStock(Order order)
    {
        return order.Items.All(item => item.Product is not null && item.Product.StockQuantity >= item.Quantity);
    }

    private static OrderResponse ToResponse(Order order)
    {
        return new OrderResponse(
            order.Id,
            order.Number,
            order.OrderDate,
            order.TotalAmount,
            order.Status,
            order.CustomerName,
            order.CustomerEmail,
            order.Items.Select(item => new OrderItemResponse(
                item.Id,
                item.ProductId,
                item.Product?.Name ?? "Product not loaded",
                item.Quantity,
                item.UnitPrice,
                item.TotalPrice)).ToList());
    }
}
