import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

type ModalProps = {
  children: React.ReactNode;
  closeLabel: string;
  maxWidthClass?: string;
  onClose: () => void;
};

export function Modal({ children, closeLabel, maxWidthClass = 'max-w-xl', onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`w-full rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8 ${maxWidthClass} relative shadow-2xl`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 rounded-full bg-white/5 p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={closeLabel}
          title={closeLabel}
        >
          <X size={20} />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
