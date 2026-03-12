using BiTikla.BusinessLayer.DependencyResolvers;
using BiTikla.DataAccessLayer.Context;
using FluentValidation;
using BiTikla.WebApi.Validators;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. DbContext - PostgreSQL
builder.Services.AddDbContext<BiTiklaDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("BiTiklaConnection")));

// 2. Repository, Manager, Mapper
builder.Services.AddRepositoryService();
builder.Services.AddManagerService();
builder.Services.AddMapperService();


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

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
