import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus, Star } from 'lucide-react';
import Button from './Button';

const AuthRequiredModal = ({ isOpen, onClose, actionName = "perform this action" }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-secondary-900 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl space-y-8 border border-white/5 relative overflow-hidden group">
        {/* Background Decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors duration-700"></div>
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors z-10"
        >
          <X className="h-6 w-6 dark:text-white" />
        </button>

        <div className="text-center space-y-6 relative z-10">
          <div className="w-20 h-20 bg-primary-500/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
            <Star className="h-10 w-10 text-primary-500 fill-current animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-black dark:text-white tracking-tight leading-tight">Authentication Required</h3>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm font-bold leading-relaxed px-4">
              Please log in or create an account to <span className="text-primary-500">{actionName}</span> and enjoy our premium features.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4 relative z-10">
          <Button 
            onClick={() => { navigate('/login'); onClose(); }}
            className="w-full py-5 rounded-2xl shadow-xl shadow-primary-500/20 flex items-center justify-center space-x-3"
          >
            <LogIn className="h-5 w-5" />
            <span>Login to Account</span>
          </Button>
          
          <button 
            onClick={() => { navigate('/signup'); onClose(); }}
            className="w-full py-5 rounded-2xl border-2 border-slate-100 dark:border-white/5 text-secondary-900 dark:text-white font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center justify-center space-x-3"
          >
            <UserPlus className="h-5 w-5" />
            <span>Create New Account</span>
          </button>
        </div>

        <p className="text-[10px] text-center font-black text-secondary-400 uppercase tracking-[0.2em]">
          Join the Smart Bite elite dining club
        </p>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
