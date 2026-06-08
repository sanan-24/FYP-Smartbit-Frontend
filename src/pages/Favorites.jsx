import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const Favorites = () => {
  const { items } = useSelector((state) => state.favorites);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <Heart className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold dark:text-white">No favorites yet</h2>
        <p className="text-gray-600 dark:text-gray-400">Save your favorite dishes to find them easily later.</p>
        <Button onClick={() => navigate('/menu')} className="mx-auto">
          Explore Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Your Favorites</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Dishes you love the most</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
