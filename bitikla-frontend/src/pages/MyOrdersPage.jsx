import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

function MyOrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await orderService.getByUserId(user.id);
        setOrders(res.data);
      } catch (err) {
        console.error("Siparişler çekilemedi", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, navigate, authLoading]);

  if (loading || authLoading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Yükleniyor...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.topBar}>
          <h2>📦 Sipariş Geçmişim</h2>
          <button onClick={() => navigate('/')} style={styles.backButton}>Ana Sayfaya Dön</button>
        </div>
        {orders.length === 0 ? (
          <p>Henüz hiç siparişiniz yok.</p>
        ) : (
          orders.map(order => (
            <motion.div key={order.id} style={styles.orderCard} initial={{opacity:0}} animate={{opacity:1}}>
              <div style={styles.header}>
                <strong>Sipariş No: #{order.id}</strong>
                <span style={styles.status(order.orderStatus)}>{order.orderStatus}</span>
              </div>
              <p>Tarih: {new Date(order.createdDate).toLocaleString('tr-TR')}</p>
              <p>Tutar: {order.totalPrice} ₺</p>
              <button 
                onClick={() => navigate(`/order/${order.id}`)}
                style={styles.detailButton}
              >
                Sipariş Detayı
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px', fontFamily: 'Arial, sans-serif' },
  content: { maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '24px', borderRadius: '16px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { backgroundColor: 'transparent', border: '1px solid #333', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' },
  orderCard: { border: '1px solid #eee', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  status: (status) => ({
    padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold',
    backgroundColor: status === 'Pending' ? '#fff3cd' : status === 'Delivered' ? '#d4edda' : '#cce5ff',
    color: status === 'Pending' ? '#856404' : status === 'Delivered' ? '#155724' : '#004085'
  }),
  detailButton: { marginTop: '10px', padding: '8px 16px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default MyOrdersPage;
