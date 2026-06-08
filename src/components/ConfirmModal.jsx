import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Delete", 
  cancelText = "Cancel",
  type = "danger" 
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-secondary-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-secondary-100 dark:border-white/5"
        >
          <div className="p-8 md:p-10">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-2xl ${type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-500'}`}>
                <AlertTriangle size={32} />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-2xl font-black text-secondary-900 dark:text-white tracking-tight">{title}</h3>
              <p className="text-secondary-500 dark:text-secondary-400 font-medium leading-relaxed">
                {message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <button 
                onClick={onClose}
                className="py-4 px-6 rounded-2xl bg-secondary-50 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 font-black text-xs uppercase tracking-widest hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all active:scale-95"
              >
                {cancelText}
              </button>
              <Button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                variant={type === 'danger' ? 'danger' : 'primary'}
                className="py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
              >
                {confirmText}
              </Button>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-secondary-50 dark:bg-secondary-800 text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
