import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet ikon sorunu fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Haritaya tıklanınca konum al
function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

function AddressPage() {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    fullAddress: '',
    city: 'İstanbul',
    district: '',
  });
  const [saved, setSaved] = useState(false);

  const handleLocationSelect = (latlng) => {
    setPosition(latlng);
    // Gerçek projede reverse geocoding yapılır
    setFormData(prev => ({
      ...prev,
      fullAddress: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`,
    }));
  };

  const handleSave = () => {
    if (!position) {
      alert('Lütfen haritadan konum seçin!');
      return;
    }
    if (!formData.title || !formData.district) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    // localStorage'a kaydet (JWT eklenince backend'e gidecek)
    const address = {
      ...formData,
      latitude: position.lat,
      longitude: position.lng,
    };
    localStorage.setItem('userAddress', JSON.stringify(address));
    setSaved(true);
    setTimeout(() => navigate(-1), 2000);
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.card}
      >
        <button onClick={() => navigate(-1)} style={styles.backButton}>← Geri</button>
        <h2 style={styles.title}>📍 Adresimi Belirle</h2>
        <p style={styles.subtitle}>Haritaya tıklayarak konumunuzu seçin</p>

        {/* Harita */}
        <div style={styles.mapContainer}>
          <MapContainer
            center={[41.0082, 28.9784]}
            zoom={12}
            style={{ height: '300px', width: '100%', borderRadius: '12px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap'
            />
            <LocationPicker onLocationSelect={handleLocationSelect} />
            {position && (
              <Marker position={position}>
                <Popup>Seçilen konum</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Form */}
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Adres başlığı (Ev, İş...)"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="İlçe"
            value={formData.district}
            onChange={e => setFormData({ ...formData, district: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Tam adres"
            value={formData.fullAddress}
            onChange={e => setFormData({ ...formData, fullAddress: e.target.value })}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={styles.saveButton}
            onClick={handleSave}
          >
            Adresi Kaydet 📍
          </motion.button>
        </div>

        {/* Başarı mesajı */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={styles.successAlert}
            >
              ✅ Adres kaydedildi!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px', fontFamily: 'Arial, sans-serif' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  backButton: { backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', marginBottom: '16px' },
  title: { fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 8px 0' },
  subtitle: { color: '#888', marginBottom: '16px' },
  mapContainer: { marginBottom: '20px', borderRadius: '12px', overflow: 'hidden' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' },
  saveButton: { backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  successAlert: { backgroundColor: '#00b894', color: 'white', borderRadius: '12px', padding: '14px', textAlign: 'center', marginTop: '16px', fontWeight: 'bold' },
};

export default AddressPage;