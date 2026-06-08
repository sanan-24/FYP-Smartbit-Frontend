import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-slate-50/50 dark:bg-secondary-950/30 border-t border-secondary-100 dark:border-secondary-800">
      <div className="flex items-center text-sm text-secondary-500 font-medium">
        Page <span className="mx-1 font-black text-primary-500">{currentPage}</span> of <span className="mx-1 font-black text-secondary-900 dark:text-white">{totalPages}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl border border-secondary-100 dark:border-secondary-800 transition-all ${
            currentPage === 1 
            ? 'opacity-50 cursor-not-allowed text-secondary-300' 
            : 'hover:bg-primary-500/10 hover:text-primary-500 text-secondary-600 dark:text-secondary-400'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-1">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                currentPage === page
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl border border-secondary-100 dark:border-secondary-800 transition-all ${
            currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed text-secondary-300' 
            : 'hover:bg-primary-500/10 hover:text-primary-500 text-secondary-600 dark:text-secondary-400'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
