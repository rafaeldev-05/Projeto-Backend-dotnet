using System.Text.Json.Serialization;
using EntregaFacil.Api.Data;
using EntregaFacil.Api.Repositories;
using EntregaFacil.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var frontendOrigins = new[]
{
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002"
};

builder.Services.AddDbContext<EntregaFacilDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(frontendOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<ICarrierRepository, CarrierRepository>();
builder.Services.AddScoped<IShipmentRepository, ShipmentRepository>();
builder.Services.AddScoped<IDeliveryOccurrenceRepository, DeliveryOccurrenceRepository>();
builder.Services.AddScoped<IDeliveryReviewRepository, DeliveryReviewRepository>();

builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<CarrierService>();
builder.Services.AddScoped<ShipmentService>();
builder.Services.AddScoped<DeliveryOccurrenceService>();
builder.Services.AddScoped<DeliveryReviewService>();
builder.Services.AddScoped<NotificationService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.MapControllers();

app.Run();
