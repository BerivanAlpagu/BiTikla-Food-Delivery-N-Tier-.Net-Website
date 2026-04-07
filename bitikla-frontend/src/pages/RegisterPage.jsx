import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userService } from '../services/api';
import { useToast } from '../context/ToastContext';

function RegisterPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Backend'in beklediği AppUserDto formatına dönüştürüyoruz
      const payload = {
        userName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        role: "Customer"
      };
      
      await userService.create(payload);
      showToast('Kayıt başarılı! Şimdi giriş yapabilirsiniz 🎉', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      showToast('Kayıt sırasında bir hata oluştu.', 'error');
      setError('Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.card}
      >
        <h2 style={styles.title}>📝 Kayıt Ol</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <input
              name="firstName"
              placeholder="Adınız"
              style={styles.input}
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Soyadınız"
              style={styles.input}
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="E-posta adresiniz"
            style={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Telefon Numaranız"
            style={styles.input}
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Şifreniz"
            style={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
          </motion.button>
        </form>
        <p style={styles.text}>
          Zaten hesabın var mı? <Link to="/login" style={styles.link}>Giriş Yap</Link>
        </p>
      </motion.div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '20px' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' },
  title: { textAlign: 'center', marginBottom: '30px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  row: { display: 'flex', gap: '15px' },
  input: { padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  button: { padding: '15px', borderRadius: '8px', border: 'none', backgroundColor: '#00b894', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  error: { color: 'red', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' },
  text: { textAlign: 'center', marginTop: '20px', color: '#666' },
  link: { color: '#00b894', textDecoration: 'none', fontWeight: 'bold' }
};

export default RegisterPage;
