import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import AddressPage from './pages/AdressPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyOrdersPage from './pages/MyOrdersPage';
import { ToastProvider } from './context/ToastContext'; // YENİ EKLENDİ

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/admin" element={
              <ProtectedRoute role="Admin">
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="/address" element={<AddressPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;