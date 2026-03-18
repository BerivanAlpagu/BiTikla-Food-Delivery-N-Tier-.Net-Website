# 🍔 BiTikla Proje Analizi — Mevcut Durum & Eksiklikler

## Genel Mimari

N-Tier (.NET 8 Web API) + React frontend mimarisi.

```
BiTikla.sln
├── BiTikla.EntityLayer         → Modeller, Enum
├── BiTikla.Configuration(Layer)→ EF Core Fluent API konfigürasyonları
├── BiTikla.DataAccessLayer     → Repository pattern, EF Core, PostgreSQL
├── BiTikla.BusinessLayer       → Manager pattern, AutoMapper, DTO'lar, DI
├── BiTikla.WebApi              → Controller'lar, FluentValidation, SeedData
└── bitikla-frontend/           → React + Axios + Framer Motion
```

---

## ✅ Ne Var (İyi Yapılanlar)

### Entity Katmanı
- [BaseEntity](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Abstract/BaseEntity.cs#11-19) (Id, CreatedDate, UpdatedDate, DeletedDate, Status) — temiz
- 8 entity: [AppUser](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/AppUser.cs#11-23), [Restaurant](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Restaurant.cs#11-28), [Category](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Category.cs#11-21), [MenuItem](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/MenuItem.cs#11-24), [Order](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Order.cs#11-26), [OrderDetail](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/OrderDetail.cs#11-22), [Courier](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Courier.cs#11-23), [Address](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Adress.cs#11-24)
- `DataStatus` enum (Inserted, Updated, Deleted) — soft delete için iyi tasarım
- Navigation property'ler doğru kurulmuş

### DataAccess Katmanı
- `IRepository<T>` + `BaseRepository<T>` generic pattern — solid
- Soft delete / hard delete ayrımı var  
- Tüm entity için ayrı repository (interface + concrete)
- EF Core, PostgreSQL (Npgsql), migration support hazır
- [GetActives()](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/Controllers/OrderController.cs#33-39), [GetPassives()](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.BusinessLayer/Managers/Concrete/BaseManager.cs#47-52), [Where()](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.DataAccessLayer/Repositories/Concrete/BaseRepository.cs#51-55) metodları var

### Business Katmanı
- `IManager<TDto>` + `BaseManager<TDto, TEntity>` generic pattern
- AutoMapper entegre ([DtoMappingProfile](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.BusinessLayer/MappingProfiles/DtoMappingProfile.cs#13-27) — tüm entity'ler map'lenmiş)
- [SoftDeleteAsync](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.BusinessLayer/Managers/Concrete/BaseManager.cs#70-81) / [HardDeleteAsync](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.BusinessLayer/Managers/Concrete/BaseManager.cs#82-91) business logic'i var
- DI resolver'lar temiz ([RepositoryResolver](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.BusinessLayer/DependencyResolves/RepositoryResolver.cs#13-26), `ManagerResolver`, `MapperResolver`)
- 8 adet DTO (BaseDto'dan türeyen)

### WebAPI Katmanı
- 8 controller (CRUD + soft/hard delete endpoint'leri)
- PostgreSQL bağlantısı, CORS (React için 3000/3001 portları)
- Swagger entegrasyonu
- [DataSeeder](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/SeedData/DataSeeder.cs#8-173) — Bogus kütüphanesi ile Türkçe fake data (20 kurye, 50 kullanıcı, 10 restoran, 150 kategori, 750 menü item, 100 sipariş vb.)

### Frontend
- React + React Router (6 sayfa)
- `CartContext` — sepet state yönetimi (farklı restoran uyarısı dahil)
- Framer Motion animasyonları
- [api.js](file:///c:/Users/ASUS/source/repos/BiTikla/bitikla-frontend/src/services/api.js) — axios ile tüm servislere bağlantı
- **Sayfalar:** [HomePage](file:///c:/Users/ASUS/source/repos/BiTikla/bitikla-frontend/src/pages/HomePage.jsx#6-103), `RestaurantPage`, [CartPage](file:///c:/Users/ASUS/source/repos/BiTikla/bitikla-frontend/src/pages/CartPage.jsx#7-143), `OrderPage`, `AdminPage`, `AddressPage`

---

## ❌ Kritik Eksiklikler

### 🔐 1. Authentication / Authorization — YOK
- [AppUser](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/AppUser.cs#11-23) modelinde `Password` alanı **plain text** olarak saklanıyor
- JWT token sistemi yok — hiçbir endpoint korumalı değil
- `[Authorize]` attribute hiçbir controller'da yok
- Login / Register endpoint'i yok
- Frontend'de kullanıcı oturumu yok (kim sipariş veriyor bilinmiyor)
- CartPage'de sipariş oluştururken `AppUserId` sabit yazılı ya da hiç gönderilmiyor

### ✅ 2. FluentValidation — TAMAMLANMAMIS
Validator dosyaları var **ama tamamen boş:**
- [AppUserValidator.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/Validators/AppUserValidator.cs) — boş class, kural yok
- [RestaurantValidator.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/Validators/RestaurantValidator.cs) — boş class, kural yok
- [OrderValidator.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/Validators/OrderValidator.cs) — boş class, kural yok
- [CourierValidator.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/Validators/CourierValidator.cs) — boş class, kural yok
- Validators **Program.cs'e register edilmemiş**
- `CategoryValidator`, `MenuItemValidator`, `AddressValidator` hiç oluşturulmamış

### 🔗 3. Özel/Filtered Endpoint Eksiklikleri
[api.js](file:///c:/Users/ASUS/source/repos/BiTikla/bitikla-frontend/src/services/api.js)'te çağrılan ama backend'de **olmayan** endpoint'ler:
- `GET /category/byrestaurant/{restaurantId}` — `CategoryController`'da yok
- `GET /menuitem/bycategory/{categoryId}` — `MenuItemController`'da yok  
- `GET /menuitem/byrestaurant/{restaurantId}` — `MenuItemController`'da yok  
- `GET /courier/available` — `CourierController`'da yok

Bu endpoint'ler olmadan `RestaurantPage` sayfası çalışmaz!

### 📦 4. Sipariş Oluşturma — EKSİK
[CartPage](file:///c:/Users/ASUS/source/repos/BiTikla/bitikla-frontend/src/pages/CartPage.jsx#7-143)'de sipariş oluştururken gönderilen veri:
```js
{ restaurantId, deliveryAddress, deliveryLatitude, deliveryLongitude, items: [...] }
```
Ama `OrderDto`:
- `AppUserId` — **zorunlu FK**, kimden geliyor? (Auth yok = sabit değer ya da 0)
- [OrderDetail](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/OrderDetail.cs#11-22) oluşturma — `POST /order` yapıldığında [OrderDetail](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/OrderDetail.cs#11-22)ler ayrı mı kaydediliyor?
- Backend'deki `OrderController.Create` yalnızca `OrderDto` alıyor, [OrderDetail](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/OrderDetail.cs#11-22)ları ayrıca kaydetmiyor

### 📄 5. OrderDetailDto — Eksik Endpoint
- [OrderDetail](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/OrderDetail.cs#11-22) için controller yok (CRUD işlemleri yapılamıyor)
- Sipariş oluşturulunca otomatik detail kayıt sistemi yok

### 🗺️ 6. Harita Entegrasyonu — Planlanmış Ama Yok
- [Address](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Adress.cs#11-24) entity'sinde `Latitude/Longitude` var (Leaflet için yorum düşülmüş)
- [Courier](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Courier.cs#11-23) entity'sinde `CurrentLatitude/CurrentLongitude` var
- Ama frontend'de harita bileşeni hiç yok

### 🎨 7. Frontend — Boş Components Klasörü
- `src/components/` **tamamen boş**
- Navbar, Footer, RestaurantCard, MenuCard gibi ortak component'ler sayfalara gömülü inline yazılmış
- Kod tekrarı oluşuyor, bakımı zor

### 🔒 8. Güvenlik Açıkları
- Password hash yok (plain text DB'ye gidiyor)
- CORS sadece localhost — production'a geçince güncellenmelidir  
- `app.UseHttpsRedirection()` **yorum satırı** — prod için aktif edilmeli
- CORS `AllowCredentials()` eksik (auth cookie/token senaryosu için gerekebilir)

### 📋 9. Eksik Configuration Katmanı (BiTikla.ConfigurationLayer)
- `BiTikla.Configuration` ve `BiTikla.ConfigurationLayer` diye iki proje var
- Hangi entity'lerin Fluent config'leri var? İçeriği incelenmeyi bekliyor
- `AppUserConfiguration`, `RestaurantConfiguration` vs. DbContext'te kullanılıyor ama bu sınıfların hepsi var mı?

### 🧪 10. Test Projesi — YOK
- Solution'da hiç unit/integration test projesi yok
- Repository, Manager, Controller katmanları test edilemiyor

---

## ⚠️ Küçük Sorunlar / İyileştirmeler

| Sorun | Yer | Not |
|-------|-----|-----|
| Dosya adı uyumsuzluğu | [Adress.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Adress.cs) ama class [Address](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Adress.cs#11-24) | Yazım hatası (adress → address) |
| `IRestaurantRepository` — büyük/küçük harf | [IrestaurantRepository.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.DataAccessLayer/Repositories/Abstract/IrestaurantRepository.cs) | Dosya adında büyük harf hatası |
| [OrderDetail](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/OrderDetail.cs#11-22) [BaseEntity](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Abstract/BaseEntity.cs#11-19)'den türüyor | [OrderDetail.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/OrderDetail.cs) | Her detail'ın Id/CreatedDate'i var — gereksiz overhead olabilir |
| `Restaurant.Categories` navigation | [Restaurant.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/Restaurant.cs) | `Category.RestaurantId` FK var ama bu ilişki tek yönlü category→restaurant |
| [GetAllAsync()](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.BusinessLayer/Managers/Concrete/BaseManager.cs#29-34) — soft delete filter yok | [BaseRepository.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.DataAccessLayer/Repositories/Concrete/BaseRepository.cs) | [GetAllAsync](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.BusinessLayer/Managers/Concrete/BaseManager.cs#29-34) silinmiş kayıtları da getiriyor, [GetActives()](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/Controllers/OrderController.cs#33-39) ise async değil |
| Arama kutusu işlevsiz | [HomePage.jsx](file:///c:/Users/ASUS/source/repos/BiTikla/bitikla-frontend/src/pages/HomePage.jsx) | Input var ama `onChange` handler yazılmamış, filter uygulanmıyor |
| [WeatherForecast.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/WeatherForecast.cs) default dosya | `BiTikla.WebApi` | Projeden silinmeli |
| SeedData her restart'ta kontrol ediyor | [DataSeeder.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/SeedData/DataSeeder.cs) | `if (context.Restaurants.Any()) return;` — migration sonrası OK |

---

## 📌 Öncelik Sırası — Ne Yapılmalı

1. **[Kritik]** Authentication ekle — JWT + ASP.NET Identity veya custom login/register
2. **[Kritik]** Özel filtreleme endpoint'lerini yaz (`byrestaurant`, `bycategory`, `available`)
3. **[Kritik]** [OrderDetail](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.EntityLayer/Models/Concrete/OrderDetail.cs#11-22)ları sipariş oluştururken otomatik kaydet
4. **[Önemli]** FluentValidation kurallarını doldur ve Program.cs'e register et
5. **[Önemli]** Password hashing ekle (BCrypt veya ASP.NET Identity)
6. **[Orta]** Frontend Component'lerini `components/` klasörüne refactor et
7. **[Orta]** Arama kutusunu çalışır hale getir (filtreleme)
8. **[Düşük]** Test projesi ekle
9. **[Düşük]** Harita entegrasyonu (Leaflet.js)
10. **[Düşük]** [WeatherForecast.cs](file:///c:/Users/ASUS/source/repos/BiTikla/BiTikla.WebApi/WeatherForecast.cs) sil, dosya adı hatalarını düzelt
