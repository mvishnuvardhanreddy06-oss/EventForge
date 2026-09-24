import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`relative bg-surface rounded-2xl shadow-2xl border border-line w-full ${maxWidth} overflow-hidden transform transition-all text-ink`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface">
          <h3 className="text-lg font-display font-bold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-ink hover:bg-bg rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
