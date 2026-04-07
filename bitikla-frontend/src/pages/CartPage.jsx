import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, restaurantService } from '../services/api';
import { useToast } from '../context/ToastContext';

function CartPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { cart, restaurantId, addToCart, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const savedAddress = JSON.parse(localStorage.getItem('userAddress'));
  const [ordering, setOrdering] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState(null);

  // Restoranın minimum sipariş tutarını yükle
  useEffect(() => {
    if (restaurantId) {
      restaurantService.getById(restaurantId)
        .then(res => setRestaurantInfo(res.data))
        .catch(() => {});
    }
  }, [restaurantId]);

  if (cart.length === 0) return (
    <div style={styles.empty}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
      >
        <div style={{ fontSize: '5rem' }}>🛒</div>
        <h2>Sepetiniz boş!</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.backButton}
          onClick={() => navigate('/')}
        >
          Restoranlara Dön
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.card}
      >
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.geri}>← Geri</button>
          <h2 style={{ margin: 0 }}>🛒 Sepetim</h2>
          <button onClick={clearCart} style={styles.clearButton}>Temizle</button>
        </div>

        {/* Adres Bölümü */}
        {!savedAddress ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            style={{ ...styles.orderButton, backgroundColor: '#2196F3', marginBottom: '10px' }}
            onClick={() => navigate('/address')}
          >
            📍 Önce Adres Ekle
          </motion.button>
        ) : (
          <div style={styles.addressCard}>
            <p style={{ margin: 0 }}>
              📍 <strong>{savedAddress.title}</strong> — {savedAddress.district}
            </p>
            <button
              onClick={() => navigate('/address')}
              style={styles.changeAddress}
            >
              Değiştir
            </button>
          </div>
        )}

        {/* Ürünler */}
        <AnimatePresence>
          {cart.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={styles.item}
            >
              <div style={styles.itemInfo}>
                <span style={styles.itemName}>{item.name}</span>
                <span style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)}₺</span>
              </div>
              <div style={styles.quantity}>
                <button style={styles.qBtn} onClick={() => removeFromCart(item.id)}>−</button>
                <span style={styles.qNum}>{item.quantity}</span>
                <button style={styles.qBtn} onClick={() => addToCart(item, restaurantId)}>+</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Toplam */}
        <div style={styles.total}>
          <span>Toplam ({totalItems} ürün)</span>
          <span style={styles.totalPrice}>{totalPrice.toFixed(2)}₺</span>
        </div>

        {/* Siparişi Onayla */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            ...styles.orderButton,
            backgroundColor: savedAddress ? '#ff6b35' : '#ccc',
            cursor: savedAddress ? 'pointer' : 'not-allowed',
          }}
          disabled={ordering}
          onClick={async () => {
            if (!isAuthenticated || !user?.id) {
              showToast('Sipariş için lütfen önce giriş yapın!', 'error');
              setTimeout(() => navigate('/login'), 1200);
              return;
            }
            if (!savedAddress) {
              showToast('Lütfen önce bir teslimat adresi ekleyin! 📍', 'error');
              return;
            }
            // GÜVENLİK: Minimum sepet tutarı frontend kontrolü
            if (restaurantInfo && totalPrice < restaurantInfo.minOrderPrice) {
              showToast(`Minimum sipariş tutarı ${restaurantInfo.minOrderPrice.toFixed(2)}₺. Sepetiniz: ${totalPrice.toFixed(2)}₺`, 'error');
              return;
            }
            setOrdering(true);
            try {
              const orderData = {
                restaurantId,
                appUserId: user.id, // Sadece giriş yapmış kullanıcının gerçek ID'si
                // totalPrice artık gönderilmiyor — backend DB'den hesaplıyor
                orderStatus: 'Pending',
                deliveryAddress: savedAddress.fullAddress,
                orderDetails: cart.map(item => ({
                  menuItemId: item.id,
                  quantity: item.quantity,
                  // unitPrice artık gönderilmiyor — backend DB'den alıyor
                })),
              };
              const res = await orderService.create(orderData);
              clearCart();
              navigate(`/order/${res.data.id}`);
            } catch (err) {
              console.error(err);
              const msg = err.response?.data || 'Sipariş oluşturulurken bir hata oluştu!';
              showToast(typeof msg === 'string' ? msg : 'Hata oluştu!', 'error');
              setOrdering(false);
            }
          }}
        >
          {ordering ? 'Sipariş Oluşturuluyor...' : 'Siparişi Onayla ✅'}
        </motion.button>
      </motion.div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' },
  empty: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: 'fit-content' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  geri: { backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' },
  clearButton: { backgroundColor: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer' },
  addressCard: { backgroundColor: '#f0f9ff', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  changeAddress: { backgroundColor: 'transparent', border: '1px solid #2196F3', color: '#2196F3', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  itemName: { fontWeight: 'bold' },
  itemPrice: { color: '#ff6b35', fontWeight: 'bold' },
  quantity: { display: 'flex', alignItems: 'center', gap: '10px' },
  qBtn: { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer', fontSize: '1.1rem' },
  qNum: { fontWeight: 'bold', minWidth: '20px', textAlign: 'center' },
  total: { display: 'flex', justifyContent: 'space-between', padding: '16px 0', marginTop: '10px', fontSize: '1.1rem' },
  totalPrice: { fontWeight: 'bold', color: '#ff6b35', fontSize: '1.3rem' },
  orderButton: { width: '100%', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  backButton: { backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 30px', fontSize: '1rem', cursor: 'pointer', marginTop: '20px' },
};

export default CartPage;