import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    // Giriş yapmamışsa login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    // Rolü yetmiyor ise (Örn: Customer Admin sayfasına girmeye çalışıyorsa) ana sayfaya at
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
