// src/shared/context/ToastContext.jsx
import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ToastContainer from '@shared/components/toast/ToastContainer';
import ConfirmDialog from '@shared/components/confirm/ConfirmDialog';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const addToast = useCallback((type, title, message, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title, message) => {
    return addToast('success', title, message);
  }, [addToast]);

  const showError = useCallback((title, message) => {
    return addToast('error', title, message, 7000); // Más tiempo para errores
  }, [addToast]);

  const showWarning = useCallback((title, message) => {
    return addToast('warning', title, message);
  }, [addToast]);

  const showInfo = useCallback((title, message) => {
    return addToast('info', title, message);
  }, [addToast]);

  const showConfirm = useCallback((title, message, confirmText, cancelText) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        show: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: null });
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: null });
          resolve(false);
        },
      });
    });
  }, []);

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
