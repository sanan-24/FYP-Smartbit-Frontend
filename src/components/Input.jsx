import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({ 
  label, 
  error, 
  className, 
  icon: Icon, 
  ...props 
}) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors duration-200">
            <Icon size={20} />
          </div>
        )}
        <input
          className={twMerge(
            'input-premium',
            Icon && 'pl-12',
            error && 'border-red-500 focus:ring-red-500/10 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
    </div>
  );
};

export default Input;
