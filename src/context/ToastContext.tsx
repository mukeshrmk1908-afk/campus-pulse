import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastContextValue {
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newToast: ToastMessage = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const config = {
            success: {
              border: 'border-emerald-500/20',
              bg: 'bg-white',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
              accent: 'bg-emerald-500',
              titleColor: 'text-emerald-950',
            },
            error: {
              border: 'border-rose-500/20',
              bg: 'bg-white',
              icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
              accent: 'bg-rose-500',
              titleColor: 'text-rose-950',
            },
            warning: {
              border: 'border-amber-500/20',
              bg: 'bg-white',
              icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
              accent: 'bg-amber-500',
              titleColor: 'text-amber-950',
            },
            info: {
              border: 'border-indigo-500/20',
              bg: 'bg-white',
              icon: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
              accent: 'bg-indigo-500',
              titleColor: 'text-indigo-950',
            },
          }[toast.type];

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl shadow-slate-900/10 border ${config.border} ${config.bg} transform transition-all duration-300 animate-in slide-in-from-bottom-3 relative overflow-hidden`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accent}`} />
              {config.icon}
              <div className="flex-1 pr-2">
                <h4 className={`text-sm font-semibold ${config.titleColor}`}>{toast.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
