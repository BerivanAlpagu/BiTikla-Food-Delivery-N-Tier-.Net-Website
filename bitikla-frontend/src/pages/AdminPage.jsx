import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { restaurantService, orderService, courierService, imageService, menuItemService, categoryService } from '../services/api';
import { useToast } from '../context/ToastContext';

function AdminPage() {
  const { showToast, showConfirm } = useToast();
  const [stats, setStats] = useState({ restaurants: 0, orders: 0, couriers: 0 });
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]); // SEÇENEKLER İÇİN EKLENDİ
  const [availableCouriers, setAvailableCouriers] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEKME YÖNETİMİ
  const [activeTab, setActiveTab] = useState('orders');

  // FORM YÖNETİMİ (RESTORAN VE MENÜ)
  const [restForm, setRestForm] = useState({ name: '', description: '', estimatedDeliveryTime: 30, address: '' });
  const [restFile, setRestFile] = useState(null);

  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: 0, categoryId: '', restaurantId: '' });
  const [menuFile, setMenuFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // KATEGORİ YÖNETİMİ
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ categoryName: '' });

  // YENİ EKLENDİ: YÖNETİM SEKMESİ STATE'LERİ (Restoran/Menü Düzenleme)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null); // seçilen restoranın id'si
  const [editingRestaurant, setEditingRestaurant] = useState(null); // düzenleme modundaki restoran obj
  const [restaurantMenuItems, setRestaurantMenuItems] = useState([]); // seçilen restoranın menü ürünleri
  const [editingMenuItem, setEditingMenuItem] = useState(null); // düzenleme modundaki menü obj
  const [newRestFile, setNewRestFile] = useState(null); // restoran resim değiştirme için
  const [newMenuFile, setNewMenuFile] = useState(null); // menü resim değiştirme için
  const [loadingMenu, setLoadingMenu] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      restaurantService.getAll().catch(() => ({ data: [] })),
      orderService.getAll().catch(() => ({ data: [] })),
      courierService.getAll().catch(() => ({ data: [] })),
      courierService.getAvailable().catch(() => ({ data: [] }))
    ]).then(([restRes, ordRes, courRes, availCourRes]) => {
      const activeRestaurants = (restRes.data || []).filter(r => r.status !== 3);
      setRestaurants(activeRestaurants);
      setStats({
        restaurants: activeRestaurants.length,
        orders: (ordRes.data || []).length,
        couriers: (courRes.data || []).length,
      });
      setAvailableCouriers(availCourRes.data || []);
      // Siparişleri tarihe göre yeniden eskiye sıralayalım
      const sortedOrders = (ordRes.data || []).sort((a, b) => b.id - a.id);
      setOrders(sortedOrders);
      setLoading(false);
    }).catch((err) => {
      console.error("Dashboard fetch error:", err);
      setLoading(false);
    });
  };

  const handleCourierAssign = async (orderId, courierId) => {
    try {
      await orderService.assignCourier(orderId, { courierId: parseInt(courierId) });
      showToast('Kurye başarıyla atandı! 🛵', 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Kurye atanamadı!', 'error');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, { status: newStatus });
      showToast(`Sipariş #${orderId} durumu güncellendi: ${newStatus} 📦`, 'success');
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Durum güncellenemedi!', 'error');
    }
  };



  // RESTORAN YÜKLEME İŞLEMİ (YENİ SEKME FONKSİYONU)
  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = "";
      if (restFile) {
        const fd = new FormData();
        fd.append("file", restFile);
        const imgRes = await imageService.upload(fd);
        imageUrl = imgRes.data.url;
      } else {
        // Logo seçilmezse bir placeholder kullanalım
        imageUrl = "https://via.placeholder.com/400x400?text=Logo+Yok";
      }

      // 2. Ardından Restoranı oluştur
      const payload = {
        name: restForm.name,
        description: restForm.description,
        estimatedDeliveryTime: parseInt(restForm.estimatedDeliveryTime),

        // minOrderPrice artık backend tarafından otomatik hesaplanıyor
        // Gönderilmiyor — create endpoint'i 0 olarak başlatıyor
        rating: 5.0, // Varsayılan süper puan
        imageUrl: imageUrl, // Fotoğraf adresi buradan geldi!
        address: restForm.address || 'Merkez', // Backend zorunlu tutuyor olabilir
        latitude: 41.0, // Varsayılan konum
        longitude: 29.0 // Varsayılan konum
      };

      await restaurantService.create(payload);
      showToast('🏪 Restoran başarıyla eklendi! Ana sayfada görünecek.', 'success');
      setRestForm({ name: '', description: '', estimatedDeliveryTime: 30, address: '' });
      setRestFile(null);
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Restoran eklenirken hata oluştu.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // MENÜ ÜRÜNÜ YÜKLEME İŞLEMİ (YENİ SEKME FONKSİYONU)
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if (!menuForm.restaurantId) { showToast('Lütfen restoran seçin!', 'error'); return; }
    setSaving(true);
    try {
      let imageUrl = "";
      if (menuFile) {
        const fd = new FormData();
        fd.append("file", menuFile);
        const imgRes = await imageService.upload(fd);
        imageUrl = imgRes.data.url;
      } else {
        // Fotoğraf seçilmezse boş bırakalım, müşteri tarafı otomatik küçük liste moduna geçecek
        imageUrl = "";
      }

      // Kategori seçimi eklendi
      if (!menuForm.categoryId) {
        showToast('Lütfen ürün için bir kategori seçin!', 'error');
        setSaving(false);
        return;
      }

      const payload = {
        name: menuForm.name,
        description: menuForm.description,
        price: parseFloat(menuForm.price),
        restaurantId: parseInt(menuForm.restaurantId),
        categoryId: parseInt(menuForm.categoryId),
        imageUrl: imageUrl,
      };

      await menuItemService.create(payload);
      showToast('🍔 Yeni ürün başarıyla eklendi!', 'success');
      setMenuForm({ name: '', description: '', price: 0, categoryId: '', restaurantId: '' });
      setMenuFile(null);
    } catch (error) {
      console.error(error);
      showToast('Ürün eklenirken hata oluştu.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ===== YENİ EKLENDİ: RESTORAN YÖNETİM İŞLEMİ (Mevcut kodlara DOKUNULMADI) =====

  // Restoran seçince menüsünü yükleme
  const handleSelectRestaurant = async (restId) => {
    setSelectedRestaurantId(restId);
    setEditingRestaurant(null);
    setEditingMenuItem(null);
    if (!restId) { setRestaurantMenuItems([]); setCategories([]); return; }
    setLoadingMenu(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        menuItemService.getByRestaurant(restId),
        categoryService.getByRestaurant(restId)
      ]);
      setRestaurantMenuItems(menuRes.data);
      setCategories((catRes.data || []).filter(c => c.status !== 3)); // Soft deleted olanları gizle
    } catch (e) { console.error(e); }
    finally { setLoadingMenu(false); }
  };

  // Menü Ekleme formunda restoran seçilince kategorileri getir
  const handleMenuRestaurantChange = async (restId) => {
    setMenuForm({ ...menuForm, restaurantId: restId, categoryId: '' });
    if (!restId) { setCategories([]); return; }
    try {
      const catRes = await categoryService.getByRestaurant(restId);
      setCategories((catRes.data || []).filter(c => c.status !== 3));
    } catch (e) { console.error(e); }
  };

  // Yeni Kategori Ekleme Fonksiyonu
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.categoryName.trim()) {
      showToast('Kategori adı boş olamaz!', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        categoryName: categoryForm.categoryName,
        restaurantId: selectedRestaurantId,
        imageUrl: '' // Şimdilik sadece isim alıyoruz, resmi boş yolluyoruz
      };
      await categoryService.create(payload);
      showToast(`Kategori "${categoryForm.categoryName}" başarıyla eklendi!`, 'success');
      setCategoryForm({ categoryName: '' });
      handleSelectRestaurant(selectedRestaurantId); // Listeyi yenile
    } catch (error) {
      console.error(error);
      showToast('Kategori eklenirken hata oluştu.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    const isConfirmed = await showConfirm(`"${name}" adlı kategoriyi silmek istediğinize emin misiniz?`);
    if (!isConfirmed) return;
    try {
      await categoryService.softDelete(id);
      showToast(`Kategori "${name}" başarıyla silindi.`, 'success');
      handleSelectRestaurant(selectedRestaurantId);
    } catch (err) {
      console.error(err);
      showToast('Kategori silinirken sunucu hatası oluştu!', 'error');
    }
  };

  // Restoran güncelle
  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = editingRestaurant.imageUrl;
      if (newRestFile) {
        const fd = new FormData();
        fd.append('file', newRestFile);
        const imgRes = await imageService.upload(fd);
        imageUrl = imgRes.data.url;
      }
      const payload = { ...editingRestaurant, imageUrl };
      await restaurantService.update(payload);
      showToast('🏪 Restoran başarıyla güncellendi!', 'success');
      setEditingRestaurant(null);
      setNewRestFile(null);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast('Restoran güncellenirken hata!', 'error');
    } finally { setSaving(false); }
  };

  // Restoran sil (Soft Delete)
  const handleSoftDeleteRestaurant = async (id, name) => {
    const isConfirmed = await showConfirm(`"${name}" adlı restoranı sistemden silmek istediğinize emin misiniz?`);
    if (!isConfirmed) return;

    try {
      await restaurantService.softDelete(id);
      showToast(`"${name}" başarıyla silindi.`, 'success');
      fetchData();
      setSelectedRestaurantId(null);
      setEditingRestaurant(null);
      setRestaurantMenuItems([]);
    } catch (err) {
      console.error(err);
      showToast('Silme işlemi sırasında sunucu hatası oluştu!', 'error');
    }
  };

  // Menü Ürünü güncelle
  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = editingMenuItem.imageUrl;
      if (newMenuFile) {
        const fd = new FormData();
        fd.append('file', newMenuFile);
        const imgRes = await imageService.upload(fd);
        imageUrl = imgRes.data.url;
      }
      const payload = { ...editingMenuItem, imageUrl };
      await menuItemService.update(payload);
      showToast('🍔 Ürün başarıyla güncellendi!', 'success');
      setEditingMenuItem(null);
      setNewMenuFile(null);
      handleSelectRestaurant(selectedRestaurantId);
    } catch (err) {
      console.error(err);
      showToast('Ürün güncellenirken hata!', 'error');
    } finally { setSaving(false); }
  };

  // Menü Ürünü sil
  const handleDeleteMenuItem = async (id, name) => {
    const isConfirmed = await showConfirm(`"${name}" adlı ürünü menüden silmek istediğinize emin misiniz?`);
    if (!isConfirmed) return;

    try {
      await menuItemService.softDelete(id);
      showToast(`"${name}" menüden başarıyla silindi.`, 'success');

      const res = await menuItemService.getByRestaurant(selectedRestaurantId);
      // Sadece aktif olanları listele (Deleted = 3)
      setRestaurantMenuItems((res.data || []).filter(item => item.status !== 3));
    } catch (err) {
      console.error(err);
      showToast('Silme işlemi sırasında sunucu hatası oluştu!', 'error');
    }
  };

  const cards = [
    { title: 'Restoranlar', value: stats.restaurants, icon: '🏪', color: '#ff6b35' },
    { title: 'Siparişler', value: stats.orders, icon: '📦', color: '#00b894' },
    { title: 'Kuryeler', value: stats.couriers, icon: '🛵', color: '#0984e3' },
  ];

  return (
    <div style={styles.container}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.title}
      >
        🎛️ Admin Paneli
      </motion.h1>

      <div style={styles.grid}>
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
            style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}
          >
            <div style={styles.cardIcon}>{card.icon}</div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ ...styles.cardValue, color: card.color }}
            >
              {card.value}
            </motion.h2>
            <p style={styles.cardTitle}>{card.title}</p>
          </motion.div>
        ))}
      </div>

      {/* SEKME MENÜSÜ */}
      <div style={styles.tabMenu}>
        <button style={activeTab === 'orders' ? styles.activeTabBtn : styles.tabBtn} onClick={() => setActiveTab('orders')}>📦 Sipariş İzleme</button>
        <button style={activeTab === 'restaurants' ? styles.activeTabBtn : styles.tabBtn} onClick={() => setActiveTab('restaurants')}>🏪 Yeni Restoran Ekle</button>
        <button style={activeTab === 'menuItems' ? styles.activeTabBtn : styles.tabBtn} onClick={() => setActiveTab('menuItems')}>🍔 Yeni Ürün Ekle</button>
        <button style={activeTab === 'manageRestaurants' ? styles.activeTabBtn : styles.tabBtn} onClick={() => setActiveTab('manageRestaurants')}>⚙️ Restoranları Yönet</button>
        <button style={activeTab === 'manageMenus' ? styles.activeTabBtn : styles.tabBtn} onClick={() => setActiveTab('manageMenus')}>📑 Menüleri Yönet</button>
      </div>

      {/* SEKME 1: SİPARİŞLER (ESKİ KOD KESİNLİKLE DEĞİŞTİRİLMEDİ) */}
      {activeTab === 'orders' && (
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>📄 Son Siparişler</h2>
          {loading ? (
            <p>Yükleniyor...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Kullanıcı</th>
                  <th style={styles.th}>Tutar</th>
                  <th style={styles.th}>Adres</th>
                  <th style={styles.th}>Kurye Ata</th>
                  <th style={styles.th}>Durum</th>
                  <th style={styles.th}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}>#{order.id}</td>
                    <td style={styles.td}>Kullanıcı {order.appUserId || '?'}</td>
                    <td style={styles.td}>{order.totalPrice ? `${order.totalPrice}₺` : '-'}</td>
                    <td style={styles.td}>{order.deliveryAddress || '-'}</td>
                    <td style={styles.td}>
                      {order.courierId ? (
                        <span style={styles.assignedBadge}>#{order.courierId}</span>
                      ) : (
                        <select
                          defaultValue=""
                          onChange={(e) => handleCourierAssign(order.id, e.target.value)}
                          style={styles.select}
                        >
                          <option value="" disabled>Kurye Seç (Boşta)</option>
                          {availableCouriers.map(c => (
                            <option key={c.id} value={c.id}>{c.fullName}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: order.status === 'Delivered' ? '#00b894' :
                          order.status === 'OnTheWay' ? '#0984e3' :
                            order.status === 'Preparing' ? '#fdcb6e' : '#ff7675'
                      }}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={styles.select}
                      >
                        <option value="Pending">Pending (Bekliyor)</option>
                        <option value="Preparing">Preparing (Hazırlanıyor)</option>
                        <option value="OnTheWay">OnTheWay (Yolda)</option>
                        <option value="Delivered">Delivered (Teslim Edildi)</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ ...styles.td, textAlign: 'center' }}>Sipariş bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* SEKME 2: YENİ RESTORAN EKLEME FORMU */}
      {activeTab === 'restaurants' && (
        <div style={styles.formContainer}>
          <h2 style={styles.tableTitle}>🏪 Yeni Bir Restoran Yarat</h2>
          <form style={styles.form} onSubmit={handleRestaurantSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Restoran Adı</label>
                <input style={styles.input} required value={restForm.name} onChange={e => setRestForm({ ...restForm, name: e.target.value })} placeholder="Örn: Burger King" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Logosu (Kare şeklinde önerilir)</label>
                <input style={styles.input} type="file" accept="image/*" onChange={e => setRestFile(e.target.files[0])} />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Kısa Açıklama, Slogan</label>
              <textarea style={styles.textarea} value={restForm.description} onChange={e => setRestForm({ ...restForm, description: e.target.value })} placeholder="Sloganınız..."></textarea>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Restoran Adresi (İlçe, Mahalle)</label>
              <input style={styles.input} required value={restForm.address} onChange={e => setRestForm({ ...restForm, address: e.target.value })} placeholder="Örn: Kadıköy, İstanbul" />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Teslimat Süresi (Dk)</label>
                <input style={styles.input} type="number" required value={restForm.estimatedDeliveryTime} onChange={e => setRestForm({ ...restForm, estimatedDeliveryTime: e.target.value })} />
              </div>
              {/* Min. Sepet Tutarı artık backend tarafından en düşük ürün fiyatından hesaplanıyor */}
            </div>

            <button type="submit" disabled={saving} style={styles.submitBtn}>
              {saving ? 'Sunucuya Kaydediliyor...' : 'Restoranı Ana Sayfada Yayınla 🚀'}
            </button>
          </form>
        </div>
      )}

      {/* SEKME 3: YENİ ÜRÜN (MENÜ) EKLEME FORMU */}
      {activeTab === 'menuItems' && (
        <div style={styles.formContainer}>
          <h2 style={styles.tableTitle}>🍽️ Restorana Yeni Yemek Ekle</h2>
          <form style={styles.form} onSubmit={handleMenuSubmit}>

            {/* 1. ADIM: Önce Restoran & Kategori */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ait Olduğu Restoran 🏪</label>
                <select style={styles.selectInput} required value={menuForm.restaurantId} onChange={e => handleMenuRestaurantChange(e.target.value)}>
                  <option value="" disabled>Restoran Seçin...</option>
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Hangi Kategoriye Eklenecek?</label>
                <select style={styles.selectInput} required value={menuForm.categoryId} onChange={e => setMenuForm({ ...menuForm, categoryId: e.target.value })} disabled={!menuForm.restaurantId || categories.length === 0}>
                  <option value="" disabled>{categories.length > 0 ? "Kategori Seçin..." : "Önce Restoran Seçin (veya Kategori Ekleyin)"}</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.categoryName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. ADIM: Ürün Bilgileri */}
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Yemek Adı</label>
                <input style={styles.input} required value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} placeholder="Örn: Karışık Izgara" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fiyatı (₺)</label>
                <input style={styles.input} type="number" step="0.01" required value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} />
              </div>
            </div>

            {/* 3. ADIM: Fotoğraf & Açıklama */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Yemek Fotoğrafı</label>
              <input style={styles.input} type="file" accept="image/*" onChange={e => setMenuFile(e.target.files[0])} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>İçindekiler / Açıklama</label>
              <textarea style={styles.textarea} value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} placeholder="Yemeğin detayları..."></textarea>
            </div>

            <button type="submit" disabled={saving} style={{ ...styles.submitBtn, backgroundColor: '#00b894' }}>
              {saving ? 'Yükleniyor...' : 'Ürünü Menüye Ekle ✅'}
            </button>
          </form>
        </div>
      )}

      {/* SEKME 4: MEVCUT RESTORANLARİ YÖNET */}
      {activeTab === 'manageRestaurants' && (
        <div style={styles.formContainer}>
          <h2 style={styles.tableTitle}>⚙️ Mevcut Restoranları Yönet</h2>
          <p style={{ color: '#636e72', marginBottom: '20px' }}>Bir restorana tıklayarak bilgilerini düzenleyebilir, resmini değiştirebilir veya gizleyebilirsiniz.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {restaurants.map(r => (
              <div key={r.id} style={{ border: selectedRestaurantId === r.id ? '2px solid #0984e3' : '1px solid #ddd', borderRadius: '12px', padding: '15px', backgroundColor: 'white', cursor: 'pointer' }}
                onClick={() => handleSelectRestaurant(selectedRestaurantId === r.id ? null : r.id)}>
                <img src={r.imageUrl} alt={r.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: '1rem' }}>{r.name}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#636e72' }}>{r.address}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setEditingRestaurant({ ...r });
                    setSelectedRestaurantId(r.id);
                    setTimeout(() => document.getElementById('edit-restaurant-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }} style={{ ...styles.actionBtn, backgroundColor: '#0984e3' }}>Düzenle</button>
                  <button onClick={(e) => { e.stopPropagation(); handleSoftDeleteRestaurant(r.id, r.name); }} style={{ ...styles.actionBtn, backgroundColor: '#d63031' }}>Sil</button>
                </div>
              </div>
            ))}
          </div>

          {/* Düzenleme Formu */}
          {editingRestaurant && (
            <div id="edit-restaurant-form" style={{ borderTop: '2px solid #ddd', paddingTop: '20px' }}>
              <h3 style={{ color: '#2d3436' }}>✏️ "{editingRestaurant.name}" Restoranını Düzenle</h3>
              <form style={styles.form} onSubmit={handleUpdateRestaurant}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Restoran Adı</label>
                    <input style={styles.input} required value={editingRestaurant.name} onChange={e => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Adres</label>
                    <input style={styles.input} value={editingRestaurant.address || ''} onChange={e => setEditingRestaurant({ ...editingRestaurant, address: e.target.value })} />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Açıklama</label>
                  <textarea style={styles.textarea} value={editingRestaurant.description || ''} onChange={e => setEditingRestaurant({ ...editingRestaurant, description: e.target.value })} />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Teslimat Süresi (Dk)</label>
                    <input style={styles.input} type="number" value={editingRestaurant.estimatedDeliveryTime} onChange={e => setEditingRestaurant({ ...editingRestaurant, estimatedDeliveryTime: parseInt(e.target.value) })} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>⭐ Puan (Kayıt Sistemiyle Otomatik Hesaplanır)</label>
                    <input style={{ ...styles.input, backgroundColor: '#f0f0f0', color: '#888' }} type="number" value={editingRestaurant.rating} readOnly disabled />
                  </div>
                </div>
                <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '10px 15px', marginBottom: '10px', fontSize: '0.85rem', color: '#856404' }}>
                  ℹ️ <strong>Min. Sipariş Tutarı</strong> ve <strong>Puan</strong> değerleri siz düzenleyemezsiniz. Min. tutar, menüdeki en düşük ürün fiyatından; puan ise müşteri değerlendirmelerinden otomatik hesaplanır.
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Mevcut Logo: <a href={editingRestaurant.imageUrl} target="_blank" rel="noreferrer" style={{ color: '#0984e3' }}>Görüntüle</a></label>
                  <img src={editingRestaurant.imageUrl} alt="mevcut" style={{ maxWidth: '150px', borderRadius: '8px', marginBottom: '8px' }} />
                  <label style={styles.label}>Yeni Logo Seç (Boş bıraksan mevcut kalır)</label>
                  <input style={styles.input} type="file" accept="image/*" onChange={e => setNewRestFile(e.target.files[0])} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" disabled={saving} style={styles.submitBtn}>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet ✅'}</button>
                  <button type="button" onClick={() => { setEditingRestaurant(null); setNewRestFile(null); }} style={{ ...styles.submitBtn, backgroundColor: '#636e72' }}>Vazgeç</button>
                  <button type="button" onClick={() => handleSoftDeleteRestaurant(editingRestaurant.id, editingRestaurant.name)} style={{ ...styles.submitBtn, backgroundColor: '#d63031' }}>Sil</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* SEKME 5: MENÜLERİ YÖNET */}
      {activeTab === 'manageMenus' && (
        <div style={styles.formContainer}>
          <h2 style={styles.tableTitle}>📑 Restorana Göre Menü Yönet</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Hangi Restoranın Menüsünü Düzenleyeceksiniz?</label>
            <select style={styles.selectInput} value={selectedRestaurantId || ''} onChange={e => handleSelectRestaurant(e.target.value)}>
              <option value="">-- Restoran Seçin --</option>
              {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {/* KATEGORİLER BÖLÜMÜ */}
          {selectedRestaurantId && !loadingMenu && (
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fdfdfd', border: '1px dashed #ccc', borderRadius: '12px' }}>
              <h3 style={{ color: '#2d3436', marginBottom: '15px' }}>Kategorileri Yönet ({categories.length} adet)</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                {categories.map(cat => (
                  <div key={cat.id} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffeaa7', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', color: '#d35400' }}>
                    {cat.categoryName}
                    <button onClick={() => handleDeleteCategory(cat.id, cat.categoryName)} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#d63031', cursor: 'pointer', fontWeight: 'bold' }}>✖</button>
                  </div>
                ))}
                {categories.length === 0 && <p style={{ color: '#888', margin: 0 }}>Bu restoran için hiç kategori açılmamış.</p>}
              </div>

              {/* Yeni Kategori Ekleme — Dropdown */}
              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px', maxWidth: '500px', flexWrap: 'wrap' }}>
                <select
                  style={{ ...styles.selectInput, flex: 1, marginBottom: 0 }}
                  value={categoryForm.categoryName}
                  onChange={e => setCategoryForm({ categoryName: e.target.value })}
                  required
                >
                  <option value="" disabled>— Kategori Seçin —</option>
                  <optgroup label="🍖 Et & Izgara">
                    <option>Burgerler</option>
                    <option>Izgara Yemekleri</option>
                    <option>Kebaplar</option>
                    <option>Köfteler</option>
                  </optgroup>
                  <optgroup label="🍕 Hamur İşleri">
                    <option>Pizzalar</option>
                    <option>Pideler</option>
                    <option>Lahmacunlar</option>
                    <option>Börekler</option>
                    <option>Tostlar & Sandviçler</option>
                  </optgroup>
                  <optgroup label="🥗 Hafif & Sağlıklı">
                    <option>Salatalar</option>
                    <option>Çorbalar</option>
                    <option>Mezeler</option>
                    <option>Soslar</option>
                    <option>Vejetaryen</option>
                  </optgroup>
                  <optgroup label="🍜 Dünya Mutfağı">
                    <option>Makarnalar</option>
                    <option>Asya Yemekleri</option>
                    <option>Deniz Ürünleri</option>
                  </optgroup>
                  <optgroup label="🍰 Tatlı & İçecek">
                    <option>Tatlılar</option>
                    <option>Dondurma & Waffle</option>
                    <option>İçecekler</option>
                    <option>Kahveler</option>
                  </optgroup>
                  <optgroup label="⭐ Özel">
                    <option>İndirimdeki Ürünler</option>
                    <option>Günün Menüsü</option>
                    <option>En Çok Satanlar</option>
                    <option>Yeni Ürünler</option>
                  </optgroup>
                </select>
                <button type="submit" disabled={saving} style={{ ...styles.submitBtn, padding: '10px 20px', marginBottom: 0 }}>
                  Ekle ➕
                </button>
              </form>
            </div>
          )}

          {loadingMenu && <p style={{ color: '#636e72', marginTop: '20px' }}>Ürünler yükleniyor...</p>}

          {!loadingMenu && selectedRestaurantId && restaurantMenuItems.length === 0 && (
            <p style={{ color: '#636e72', marginTop: '20px' }}>Bu restorana eklemiş ürün bulunamadı.</p>
          )}

          {!loadingMenu && restaurantMenuItems.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ color: '#2d3436', marginBottom: '15px' }}>Menü Ürünleri ({restaurantMenuItems.length} adet)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px' }}>
                {restaurantMenuItems.map(item => (
                  <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white' }}>
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ margin: '0 0 4px' }}>{item.name}</h4>
                      <p style={{ margin: '0 0 8px', color: '#ff6b35', fontWeight: 'bold' }}>{item.price}₺</p>
                      <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#636e72' }}>{item.description}</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => {
                          setEditingMenuItem({ ...item });
                          setTimeout(() => document.getElementById('edit-menuitem-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                        }} style={{ ...styles.actionBtn, backgroundColor: '#0984e3', flex: 1 }}>Düzenle</button>
                        <button onClick={() => handleDeleteMenuItem(item.id, item.name)} style={{ ...styles.actionBtn, backgroundColor: '#d63031', flex: 1 }}>Sil</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menü Ürün Düzenleme Formu */}
          {editingMenuItem && (
            <div id="edit-menuitem-form" style={{ borderTop: '2px solid #ddd', paddingTop: '20px', marginTop: '20px' }}>
              <h3 style={{ color: '#2d3436' }}>✏️ "{editingMenuItem.name}" Ürününü Düzenle</h3>
              <form style={styles.form} onSubmit={handleUpdateMenuItem}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Ad</label>
                    <input style={styles.input} required value={editingMenuItem.name} onChange={e => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Kategori</label>
                    <select style={styles.selectInput} required value={editingMenuItem.categoryId || ''} onChange={e => setEditingMenuItem({ ...editingMenuItem, categoryId: parseInt(e.target.value) })}>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                    </select>
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Fiyat (₺)</label>
                    <input style={styles.input} type="number" step="0.01" required value={editingMenuItem.price} onChange={e => setEditingMenuItem({ ...editingMenuItem, price: parseFloat(e.target.value) })} />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Açıklama</label>
                  <textarea style={styles.textarea} value={editingMenuItem.description || ''} onChange={e => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Mevcut Fotoğraf:</label>
                  <img src={editingMenuItem.imageUrl} alt="mevcut" style={{ maxWidth: '150px', borderRadius: '8px', marginBottom: '8px' }} />
                  <label style={styles.label}>Yeni Fotoğraf Seç (Boş bıraksan mevcut kalır)</label>
                  <input style={styles.input} type="file" accept="image/*" onChange={e => setNewMenuFile(e.target.files[0])} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" disabled={saving} style={{ ...styles.submitBtn, backgroundColor: '#00b894' }}>{saving ? 'Kaydediliyor...' : 'Ürünü Güncelle ✅'}</button>
                  <button type="button" onClick={() => { setEditingMenuItem(null); setNewMenuFile(null); }} style={{ ...styles.submitBtn, backgroundColor: '#636e72' }}>Vazgeç</button>
                  <button type="button" onClick={() => handleDeleteMenuItem(editingMenuItem.id, editingMenuItem.name)} style={{ ...styles.submitBtn, backgroundColor: '#d63031' }}>Sil</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '40px 20px' },
  title: { textAlign: 'center', fontSize: '2rem', marginBottom: '40px', color: '#2d3436' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '30px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  cardIcon: { fontSize: '2.5rem', marginBottom: '15px' },
  cardValue: { fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 8px' },
  cardTitle: { color: '#636e72', margin: 0, fontSize: '1rem' },
  tableContainer: { marginTop: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  tableTitle: { marginTop: 0, color: '#2d3436' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px 15px', borderBottom: '2px solid #eee', color: '#636e72', fontWeight: 'bold' },
  td: { padding: '12px 15px', borderBottom: '1px solid #eee', color: '#2d3436' },
  tr: { transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f9f9f9' } },
  statusBadge: { padding: '4px 8px', borderRadius: '12px', color: 'white', fontSize: '0.85rem', fontWeight: 'bold' },
  assignedBadge: { padding: '4px 8px', borderRadius: '12px', backgroundColor: '#e17055', color: 'white', fontSize: '0.85rem', fontWeight: 'bold' },
  select: { padding: '6px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', cursor: 'pointer' },



  // SEKME VE FORM STİLLERİ
  tabMenu: { display: 'flex', gap: '10px', marginTop: '40px', borderBottom: '2px solid #ddd', paddingBottom: '10px' },
  tabBtn: { backgroundColor: 'transparent', color: '#636e72', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', transition: 'all 0.2s' },
  activeTabBtn: { backgroundColor: '#2d3436', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  formContainer: { marginTop: '30px', backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' },
  formRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  formGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '250px' },
  label: { fontWeight: 'bold', color: '#2d3436', fontSize: '0.9rem' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' },
  selectInput: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', cursor: 'pointer' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', minHeight: '100px', resize: 'vertical' },
  submitBtn: { padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#ff6b35', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  actionBtn: { padding: '8px 12px', borderRadius: '8px', border: 'none', color: 'white', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }
};

export default AdminPage;