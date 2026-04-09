using Bogus;
using BiTikla.DataAccessLayer.Context;
using BiTikla.EntityLayer.Enums;
using BiTikla.EntityLayer.Models.Concrete;

namespace BiTikla.WebApi.SeedData
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(BiTiklaDbContext context)
        {
            if (context.Restaurants.Any()) return;

            var faker = new Faker("tr");

            // 1. Kuryeler
            var couriers = new List<Courier>();
            for (int i = 0; i < 20; i++)
            {
                couriers.Add(new Courier
                {
                    FullName = faker.Name.FirstName() + " " + faker.Name.LastName(),
                    PhoneNumber = "05" + faker.Random.Number(100000000, 999999999).ToString(),
                    VehicleType = faker.Random.ArrayElement(new[] { "Motor", "Bisiklet", "Araba" }),
                    IsAvailable = faker.Random.Bool(),
                    CurrentLatitude = faker.Random.Double(41.0, 41.2),
                    CurrentLongitude = faker.Random.Double(28.8, 29.2),
                    CreatedDate = DateTime.UtcNow,
                    Status = DataStatus.Inserted
                });
            }
            await context.Couriers.AddRangeAsync(couriers);
            await context.SaveChangesAsync();

            // 2. Kullanıcılar
            var users = new List<AppUser>();
            
            // TEST İÇİN SABİT HESAPLAR
            users.Add(new AppUser {
                UserName = "admin",
                Email = "admin@bitikla.com",
                Password = "admin123",
                Role = "Admin",
                CreatedDate = DateTime.UtcNow,
                Status = DataStatus.Inserted
            });

            users.Add(new AppUser {
                UserName = "customer",
                Email = "customer@bitikla.com",
                Password = "customer123",
                Role = "Customer",
                CreatedDate = DateTime.UtcNow,
                Status = DataStatus.Inserted
            });

            for (int i = 0; i < 50; i++)
            {
                users.Add(new AppUser
                {
                    UserName = faker.Internet.UserName(),
                    Email = faker.Internet.Email(faker.Name.FirstName(), faker.Name.LastName(), "gmail.com"),
                    Password = faker.Lorem.Word(),
                    PhoneNumber = "05" + faker.Random.Number(100000000, 999999999).ToString(),
                    Role = faker.Random.ArrayElement(new[] { "Customer", "Admin" }),
                    CreatedDate = DateTime.UtcNow,
                    Status = DataStatus.Inserted
                });
            }
            await context.AppUsers.AddRangeAsync(users);
            await context.SaveChangesAsync();

            // 3. Restoranlar
            var restaurantData = new[]
            {
                new { Name = "Burger House",     Image = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
                new { Name = "Pizza Roma",        Image = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
                new { Name = "Sushi Bar",         Image = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80" },
                new { Name = "Döner Palace",      Image = "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80" },
                new { Name = "Tantuni Express",   Image = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" },
                new { Name = "Kebap World",       Image = "https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=400&q=80" },
                new { Name = "Lahmacun City",     Image = "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&q=80" },
                new { Name = "Pide Corner",       Image = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" },
                new { Name = "Izgara Plus",       Image = "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
                new { Name = "Fast Falafel",      Image = "https://images.unsplash.com/photo-1614937563502-69c4a0b3e59e?w=400&q=80" },
            };

            var restaurants = new List<Restaurant>();
            for (int i = 0; i < 10; i++)
            {
                var rd = restaurantData[i];
                restaurants.Add(new Restaurant
                {
                    Name = rd.Name + " " + faker.Address.City(),
                    Description = faker.Lorem.Sentence(),
                    ImageUrl = rd.Image,
                    Address = faker.Address.StreetAddress(),
                    Latitude = faker.Random.Double(41.0, 41.2),
                    Longitude = faker.Random.Double(28.8, 29.2),
                    MinOrderPrice = faker.Random.Decimal(30, 100),

                    EstimatedDeliveryTime = faker.Random.Int(15, 60),
                    Rating = Math.Round(faker.Random.Double(3.0, 5.0), 1),
                    CreatedDate = DateTime.UtcNow,
                    Status = DataStatus.Inserted
                });
            }
            await context.Restaurants.AddRangeAsync(restaurants);
            await context.SaveChangesAsync();

            // 4. Kategoriler
            var categoryNames = new[] {
                "Burgerler", "Pizzalar", "Salatalar",
                "İçecekler", "Tatlılar", "Yan Ürünler"
            };

            var categories = new List<Category>();
            foreach (var restaurant in restaurants)
            {
                for (int i = 0; i < 3; i++)
                {
                    categories.Add(new Category
                    {
                        CategoryName = faker.Random.ArrayElement(categoryNames),
                        ImageUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
                        RestaurantId = restaurant.Id,
                        CreatedDate = DateTime.UtcNow,
                        Status = DataStatus.Inserted
                    });
                }
            }
            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();

            // 5. Menü Ürünleri
            var foodImages = new[]
            {
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
                "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
                "https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=400&q=80",
                "https://images.unsplash.com/photo-1614937563502-69c4a0b3e59e?w=400&q=80",
                "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&q=80",
            };

            var menuItems = new List<MenuItem>();
            foreach (var category in categories)
            {
                for (int i = 0; i < 5; i++)
                {
                    menuItems.Add(new MenuItem
                    {
                        Name = faker.Commerce.ProductName(),
                        Description = faker.Lorem.Sentence(),
                        Price = faker.Random.Decimal(20, 200),
                        ImageUrl = faker.Random.ArrayElement(foodImages),
                        IsAvailable = true,
                        CategoryId = category.Id,
                        CreatedDate = DateTime.UtcNow,
                        Status = DataStatus.Inserted
                    });
                }
            }
            await context.MenuItems.AddRangeAsync(menuItems);
            await context.SaveChangesAsync();

            // 6. Siparişler
            var random = new Random();
            var orders = new List<Order>();
            for (int i = 0; i < 100; i++)
            {
                orders.Add(new Order
                {
                    DeliveryAddress = faker.Address.StreetAddress(),
                    TotalPrice = faker.Random.Decimal(50, 500),
                    OrderStatus = faker.Random.ArrayElement(new[] {
                        "Pending", "Preparing", "OnTheWay", "Delivered" }),
                    AppUserId = users[random.Next(users.Count)].Id,
                    RestaurantId = restaurants[random.Next(restaurants.Count)].Id,
                    CourierId = couriers[random.Next(couriers.Count)].Id,
                    CreatedDate = DateTime.UtcNow,
                    Status = DataStatus.Inserted
                });
            }
            await context.Orders.AddRangeAsync(orders);
            await context.SaveChangesAsync();

            // 7. Adresler
            var addresses = new List<Address>();
            foreach (var user in users.Take(20)) // ilk 20 kullanıcıya adres ekle
            {
                addresses.Add(new Address
                {
                    Title = "Ev",
                    FullAddress = faker.Address.StreetAddress(),
                    City = "İstanbul",
                    District = faker.Random.ArrayElement(new[] {
            "Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Maltepe" }),
                    Latitude = faker.Random.Double(41.0, 41.2),
                    Longitude = faker.Random.Double(28.8, 29.2),
                    AppUserId = user.Id,
                    CreatedDate = DateTime.UtcNow,
                    Status = DataStatus.Inserted
                });
            }
            await context.Addresses.AddRangeAsync(addresses);
            await context.SaveChangesAsync();

            Console.WriteLine("✅ Seed data başarıyla oluşturuldu!");
        }
    }
}