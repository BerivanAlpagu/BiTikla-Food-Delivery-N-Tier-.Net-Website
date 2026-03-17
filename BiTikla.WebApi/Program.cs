using BiTikla.BusinessLayer.DependencyResolvers;
using BiTikla.DataAccessLayer.Context;
using BiTikla.WebApi.SeedData;
using BiTikla.WebApi.Validators;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. DbContext - PostgreSQL
builder.Services.AddDbContext<BiTiklaDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("BiTiklaConnection")));

// 2. Repository, Manager, Mapper
builder.Services.AddRepositoryService();
builder.Services.AddManagerService();
builder.Services.AddMapperService();

// 3. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3001"
        )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. Controller
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Seed Data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider
        .GetRequiredService<BiTiklaDbContext>();
    await DataSeeder.SeedAsync(context);
}

app.UseCors("AllowReact");
//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();