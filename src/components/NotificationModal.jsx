import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Package, CheckCircle, Info } from 'lucide-react';
import Button from './Button';

const NotificationModal = ({ isOpen, onClose, title, message, type = 'info' }) => {
    const icons = {
        info: <Info className="h-6 w-6 text-blue-500" />,
        success: <CheckCircle className="h-6 w-6 text-green-500" />,
        order: <Package className="h-6 w-6 text-primary-500" />,
        alert: <Bell className="h-6 w-6 text-orange-500" />
    };

    const bgs = {
        info: 'bg-blue-50 dark:bg-blue-900/20',
        success: 'bg-green-50 dark:bg-green-900/20',
        order: 'bg-primary-50 dark:bg-primary-900/20',
        alert: 'bg-orange-50 dark:bg-orange-900/20'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-white dark:bg-secondary-900 rounded-[2.5rem] shadow-2xl border border-secondary-100 dark:border-secondary-800 overflow-hidden"
                    >
                        <div className="p-8">
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl text-secondary-400 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className={`${bgs[type]} p-5 rounded-[1.5rem] mb-6`}>
                                    {icons[type]}
                                </div>
                                
                                <h3 className="text-2xl font-black text-secondary-900 dark:text-white mb-2 tracking-tight">
                                    {title}
                                </h3>
                                
                                <p className="text-secondary-500 dark:text-secondary-400 font-medium leading-relaxed mb-8 px-2">
                                    {message}
                                </p>

                                <Button 
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl font-black shadow-lg shadow-primary-500/20"
                                >
                                    Got it!
                                </Button>
                            </div>
                        </div>
                        
                        {/* Decorative bottom bar */}
                        <div className="h-2 w-full bg-primary-500" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NotificationModal;
