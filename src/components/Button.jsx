import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-glow active:scale-95',
    secondary: 'bg-secondary-900 text-white hover:bg-secondary-800 dark:bg-secondary-700 dark:hover:bg-secondary-600 shadow-soft active:scale-95',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white active:scale-95',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-soft active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-3xl',
  };

  return (
    <button
      className={twMerge(
        'font-bold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
