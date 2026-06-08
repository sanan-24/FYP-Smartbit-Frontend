import React from 'react';
import { twMerge } from 'tailwind-merge';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
    <Skeleton className="h-48 sm:h-56 w-full rounded-none" />
    <div className="p-5 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  </div>
);

export default Skeleton;
