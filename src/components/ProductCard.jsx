import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Clock, Plus } from 'lucide-react';
import { addToCart } from '../features/cartSlice';
import { toggleFavorite } from '../features/favoriteSlice';
import AuthRequiredModal from './AuthRequiredModal';

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: favorites } = useSelector((state) => state.favorites);
  const isFavorite = favorites.some(fav => (fav._id || fav.id) === (item._id || item.id));
  
  const [authModal, setAuthModal] = useState({ isOpen: false, action: '' });

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, action: 'save items to your favorites' });
      return;
    }
    dispatch(toggleFavorite(item));
  };

  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, action: 'add items to your cart' });
      return;
    }
    dispatch(addToCart(item));
  };

  return (
    <>
      <AuthRequiredModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        actionName={authModal.action}
      />
      
      <div className="card-premium group">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <button 
            onClick={handleFavoriteClick}
            className={`absolute top-5 right-5 p-3 rounded-2xl backdrop-blur-md transition-all duration-300 transform active:scale-90 shadow-soft ${
              isFavorite 
                ? 'bg-primary-500 text-white shadow-glow' 
                : 'bg-white/80 text-slate-400 hover:text-primary-500 dark:bg-secondary-900/80'
            }`}
          >
            <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <div className="absolute bottom-5 left-5 bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest text-secondary-900 dark:text-primary-400 shadow-soft">
            {item.category}
          </div>
        </div>
        
        <div className="p-5 md:p-7 space-y-4 md:space-y-5">
          <div className="flex justify-between items-start">
            <h3 className="text-lg md:text-xl font-black text-secondary-900 dark:text-white leading-tight line-clamp-1">{item.name}</h3>
            <span className="text-lg md:text-xl font-black text-primary-500">${item.price}</span>
          </div>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 h-10">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5 text-primary-500" /> 25 min</span>
              <span className="flex items-center">
                <Star className={`h-3.5 w-3.5 mr-1.5 ${item.averageRating > 0 ? 'text-primary-500 fill-current' : 'text-slate-300'}`} /> 
                {item.averageRating > 0 ? `${item.averageRating} (${item.numReviews})` : 'No reviews'}
              </span>
            </div>
            <button 
              onClick={handleAddToCartClick}
              className="bg-secondary-900 dark:bg-primary-500 text-white p-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-soft dark:shadow-glow"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
