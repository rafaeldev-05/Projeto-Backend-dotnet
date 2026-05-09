using EntregaFacil.Api.Enums;
using EntregaFacil.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EntregaFacil.Api.Data;

public class EntregaFacilDbContext(DbContextOptions<EntregaFacilDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Carrier> Carriers => Set<Carrier>();
    public DbSet<Shipment> Shipments => Set<Shipment>();
    public DbSet<DeliveryOccurrence> DeliveryOccurrences => Set<DeliveryOccurrence>();
    public DbSet<DeliveryReview> DeliveryReviews => Set<DeliveryReview>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasIndex(product => product.Code).IsUnique();
            entity.Property(product => product.Code).HasMaxLength(30).IsRequired();
            entity.Property(product => product.Name).HasMaxLength(120).IsRequired();
            entity.Property(product => product.Description).HasMaxLength(500);
            entity.Property(product => product.Price).HasPrecision(10, 2);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasIndex(order => order.Number).IsUnique();
            entity.Property(order => order.Number).HasMaxLength(30).IsRequired();
            entity.Property(order => order.CustomerName).HasMaxLength(120).IsRequired();
            entity.Property(order => order.CustomerEmail).HasMaxLength(160).IsRequired();
            entity.Property(order => order.TotalAmount).HasPrecision(10, 2);
            entity.Property(order => order.Status).HasConversion<string>().HasMaxLength(40).IsRequired();
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.Property(item => item.UnitPrice).HasPrecision(10, 2);
            entity.Property(item => item.TotalPrice).HasPrecision(10, 2);

            entity
                .HasOne(item => item.Order)
                .WithMany(order => order.Items)
                .HasForeignKey(item => item.OrderId);

            entity
                .HasOne(item => item.Product)
                .WithMany(product => product.OrderItems)
                .HasForeignKey(item => item.ProductId);
        });

        modelBuilder.Entity<Carrier>(entity =>
        {
            entity.Property(carrier => carrier.Name).HasMaxLength(120).IsRequired();
            entity.Property(carrier => carrier.Cnpj).HasMaxLength(20).IsRequired();
            entity.Property(carrier => carrier.Phone).HasMaxLength(30);
        });

        modelBuilder.Entity<Shipment>(entity =>
        {
            entity.HasIndex(shipment => shipment.OrderId).IsUnique();
            entity.Property(shipment => shipment.TrackingCode).HasMaxLength(80).IsRequired();

            entity
                .HasOne(shipment => shipment.Order)
                .WithOne(order => order.Shipment)
                .HasForeignKey<Shipment>(shipment => shipment.OrderId);

            entity
                .HasOne(shipment => shipment.Carrier)
                .WithMany(carrier => carrier.Shipments)
                .HasForeignKey(shipment => shipment.CarrierId);
        });

        modelBuilder.Entity<DeliveryOccurrence>(entity =>
        {
            entity.Property(occurrence => occurrence.Type).HasConversion<string>().HasMaxLength(40).IsRequired();
            entity.Property(occurrence => occurrence.Description).HasMaxLength(500).IsRequired();

            entity
                .HasOne(occurrence => occurrence.Order)
                .WithMany(order => order.DeliveryOccurrences)
                .HasForeignKey(occurrence => occurrence.OrderId);
        });

        modelBuilder.Entity<DeliveryReview>(entity =>
        {
            entity.HasIndex(review => review.OrderId).IsUnique();
            entity.Property(review => review.Comment).HasMaxLength(500);

            entity
                .HasOne(review => review.Order)
                .WithOne(order => order.DeliveryReview)
                .HasForeignKey<DeliveryReview>(review => review.OrderId);
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Code = "PRD-001", Name = "Wireless Mouse", Description = "Ergonomic wireless mouse", Price = 89.90m, StockQuantity = 20 },
            new Product { Id = 2, Code = "PRD-002", Name = "Mechanical Keyboard", Description = "Compact mechanical keyboard", Price = 249.90m, StockQuantity = 12 },
            new Product { Id = 3, Code = "PRD-003", Name = "USB-C Hub", Description = "Hub with HDMI and USB ports", Price = 159.90m, StockQuantity = 8 });

        modelBuilder.Entity<Carrier>().HasData(
            new Carrier { Id = 1, Name = "FastLog Express", Cnpj = "12.345.678/0001-90", Phone = "(11) 3000-1000" },
            new Carrier { Id = 2, Name = "Entrega Sul", Cnpj = "98.765.432/0001-10", Phone = "(41) 3000-2000" });

        modelBuilder.Entity<Order>().HasData(
            new Order
            {
                Id = 1,
                Number = "ORD-1001",
                OrderDate = new DateTime(2026, 5, 1, 10, 0, 0, DateTimeKind.Utc),
                TotalAmount = 339.80m,
                Status = OrderStatus.AwaitingSeparation,
                CustomerName = "Ana Souza",
                CustomerEmail = "ana.souza@example.com"
            },
            new Order
            {
                Id = 2,
                Number = "ORD-1002",
                OrderDate = new DateTime(2026, 5, 2, 14, 30, 0, DateTimeKind.Utc),
                TotalAmount = 159.90m,
                Status = OrderStatus.AwaitingSeparation,
                CustomerName = "Bruno Lima",
                CustomerEmail = "bruno.lima@example.com"
            });

        modelBuilder.Entity<OrderItem>().HasData(
            new OrderItem { Id = 1, OrderId = 1, ProductId = 1, Quantity = 1, UnitPrice = 89.90m, TotalPrice = 89.90m },
            new OrderItem { Id = 2, OrderId = 1, ProductId = 2, Quantity = 1, UnitPrice = 249.90m, TotalPrice = 249.90m },
            new OrderItem { Id = 3, OrderId = 2, ProductId = 3, Quantity = 1, UnitPrice = 159.90m, TotalPrice = 159.90m });
    }
}
