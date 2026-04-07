import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: '', isVisible: false });
  const [confirmState, setConfirmState] = useState({ isVisible: false, message: '', onConfirm: null, onCancel: null });

  // success, error, info
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, isVisible: true });

    // 4 saniye sonra otomatik kapanması için
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 4000);
  }, []);

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({
        isVisible: true,
        message,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, isVisible: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, isVisible: false }));
          resolve(false);
        }
      });
    });
  }, []);

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success': return '#00b894'; // Yeşil
      case 'error': return '#d63031'; // Kırmızı (Daha dikkat çekici)
      case 'info': return '#0984e3'; // Mavi
      default: return '#2d3436'; // Koyu Gri
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}
      
      {/* GLOBAL TOAST POPUP (Daha büyük ve ortalanmış) */}
      <AnimatePresence>
        {toast.isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -100, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, y: -50, x: "-50%" }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'fixed',
              top: '40px',
              left: '50%',
              zIndex: 99999, // Her şeyin üstünde çıkması için
              backgroundColor: getBackgroundColor(toast.type),
              color: 'white',
              padding: '24px 40px',
              borderRadius: '16px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              minWidth: '350px',
              maxWidth: '80%',
              justifyContent: 'center'
            }}
            onClick={hideToast}
          >
            <span style={{ fontSize: '2rem' }}>{getIcon(toast.type)}</span>
            <span style={{ fontSize: '1.4rem', textAlign: 'center', lineHeight: '1.4' }}>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL CONFIRM MODAL (Sıkıcı window.confirm yerine) */}
      <AnimatePresence>
        {confirmState.isVisible && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '20px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
              <h2 style={{ color: '#2d3436', marginBottom: '15px', fontSize: '1.8rem' }}>Emin misiniz?</h2>
              <p style={{ color: '#636e72', fontSize: '1.2rem', marginBottom: '35px', lineHeight: '1.5' }}>
                {confirmState.message}
              </p>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmState.onCancel}
                  style={{
                    padding: '12px 24px', backgroundColor: '#f5f6fa', color: '#2d3436',
                    border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', flex: 1
                  }}
                >
                  İptal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmState.onConfirm}
                  style={{
                    padding: '12px 24px', backgroundColor: '#d63031', color: 'white',
                    border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', flex: 1,
                    boxShadow: '0 4px 15px rgba(214, 48, 49, 0.4)'
                  }}
                >
                  Evet, Sil
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
