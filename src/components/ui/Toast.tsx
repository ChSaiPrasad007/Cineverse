'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useEffect, createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info'; }

const ToastContext = createContext<{ toast: (msg: string, type?: Toast['type']) => void }>({ toast: () => {} });

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onRemove={remove} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast: t, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), 2500);
    return () => clearTimeout(timer);
  }, [t.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="pointer-events-auto flex items-center gap-3 bg-white text-black px-5 py-3 rounded-full shadow-2xl"
    >
      {t.type === 'success' && <Check size={16} className="text-green-600" />}
      {t.type === 'error' && <X size={16} className="text-red-500" />}
      <span className="text-sm font-medium whitespace-nowrap">{t.message}</span>
    </motion.div>
  );
}
