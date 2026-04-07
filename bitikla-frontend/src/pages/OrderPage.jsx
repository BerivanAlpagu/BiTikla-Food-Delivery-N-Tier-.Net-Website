import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { orderService } from '../services/api';

// Leaflet ikon sorunu fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = () => {
      orderService.getById(id)
        .then(res => {
          setOrder(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError(true);
          setLoading(false);
        });
    };

    fetchOrder(); // Initial fetch
    
    // Yalnızca sipariş Teslim Edilmediyse pole et
    const interval = setInterval(() => {
      setOrder(prev => {
        if (prev?.status === 'Delivered') {
          clearInterval(interval);
        }
        return prev;
      });
      fetchOrder();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const statuses = ['Pending', 'Preparing', 'OnTheWay', 'Delivered'];
  const statusLabels = {
    Pending: '⏳ Bekliyor',
    Preparing: '👨‍🍳 Hazırlanıyor',
    OnTheWay: '🛵 Yolda',
    Delivered: '✅ Teslim Edildi',
  };

  if (loading) return (
    <div style={styles.container}>
      <p style={{ textAlign: 'center', marginTop: '40px' }}>Sipariş yükleniyor...</p>
    </div>
  );

  if (error || !order) return (
    <div style={styles.container}>
      <p style={{ textAlign: 'center', marginTop: '40px', color: 'red' }}>Sipariş bulunamadı.</p>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );

  const currentStatus = order.status || 'Pending';
  const lat = order.deliveryLatitude || 41.0082;
  const lng = order.deliveryLongitude || 28.9784;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sipariş Takip #{order.id}</h1>

      {/* Durum adımları */}
      <div style={styles.statusContainer}>
        {statuses.map((status, index) => (
          <motion.div
            key={status}
            style={{
              ...styles.statusStep,
              backgroundColor: statuses.indexOf(currentStatus) >= index ? '#ff6b35' : '#e0e0e0',
            }}
            animate={{
              scale: currentStatus === status ? 1.2 : 1,
            }}
          >
            <span style={styles.statusLabel}>{statusLabels[status]}</span>
          </motion.div>
        ))}
      </div>

      {/* Harita */}
      <div style={styles.mapContainer}>
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          style={{ height: '400px', width: '100%', borderRadius: '16px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>Teslimat adresi 📍</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' },
  title: { textAlign: 'center', fontSize: '1.8rem', marginBottom: '30px' },
  statusContainer: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' },
  statusStep: { padding: '10px 20px', borderRadius: '25px', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' },
  statusLabel: { whiteSpace: 'nowrap' },
  mapContainer: { maxWidth: '800px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
};

export default OrderPage;