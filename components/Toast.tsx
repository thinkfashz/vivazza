
"use client";

import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const Toast: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />
  };

  const bgColors = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500'
  };

  return (
    <div className={`pointer-events-auto min-w-[300px] bg-white border-l-4 ${bgColors[toast.type]} shadow-2xl rounded-2xl p-5 flex items-start gap-3 animate-slide-in-right border border-gray-100`}>
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-bold text-vivazza-stone uppercase tracking-tight">{toast.type === 'success' ? 'Éxito' : toast.type === 'error' ? 'Error' : 'Aviso'}</p>
        <p className="text-xs font-medium text-gray-500 leading-relaxed">{toast.message}</p>
      </div>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors">
        <X size={18} />
      </button>
    </div>
  );
};
