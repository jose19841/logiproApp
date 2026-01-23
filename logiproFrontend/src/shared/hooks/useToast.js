// src/shared/hooks/useToast.js
import { useContext } from 'react';
import { ToastContext } from '@shared/context/ToastContext';

export default function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
