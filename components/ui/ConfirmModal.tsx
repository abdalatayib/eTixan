import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../services/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/40',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-yellow-900/40',
    info: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/40'
  };

  const iconClasses = {
    danger: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className={cn("flex-shrink-0", iconClasses[variant])} size={24} />
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-300 mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer font-medium"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={cn(
              "px-6 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer",
              variantClasses[variant]
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
