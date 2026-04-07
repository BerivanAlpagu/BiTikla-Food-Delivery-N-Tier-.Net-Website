import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { useToast } from '../context/ToastContext';

function LoginPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await userService.login({ email, password });
      
      // Backend artık token ve user nesnesi dönüyor (camelCase olarak çevrilmiş)
      login(res.data.user, res.data.token);
      showToast('Başarıyla giriş yapıldı! Hoş geldiniz 🎉', 'success');
      navigate('/');
    } catch (err) {
      showToast('Giriş başarısız. E-posta veya şifre hatalı!', 'error');
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
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
        <h2 style={styles.title}>🍔 Giriş Yap</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="E-posta adresiniz"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifreniz"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </motion.button>
        </form>
        <p style={styles.text}>
          Hesabın yok mu? <Link to="/register" style={styles.link}>Kayıt Ol</Link>
        </p>
      </motion.div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', marginBottom: '30px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' },
  button: { padding: '15px', borderRadius: '8px', border: 'none', backgroundColor: '#ff6b35', color: 'white', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' },
  text: { textAlign: 'center', marginTop: '20px', color: '#666' },
  link: { color: '#ff6b35', textDecoration: 'none', fontWeight: 'bold' }
};

export default LoginPage;
