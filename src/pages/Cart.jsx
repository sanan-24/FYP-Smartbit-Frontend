import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../features/cartSlice';
import Button from '../components/Button';

const Cart = () => {
  const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
        <div className="bg-slate-50 dark:bg-secondary-900 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-soft">
          <ShoppingBag className="h-16 w-16 text-secondary-300" />
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight">Your cart is empty</h2>
          <p className="text-secondary-500 dark:text-secondary-400 text-lg font-medium">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Button onClick={() => navigate('/menu')} className="mx-auto px-10 py-4 text-lg shadow-glow">
          Explore the Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8 md:mb-12 space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-secondary-900 dark:text-white tracking-tighter">Your <span className="text-primary-500">Cart</span></h1>
        <p className="text-secondary-500 dark:text-secondary-400 text-base md:text-lg font-medium">{totalQuantity} gourmet items selected</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white dark:bg-app-surface-dark p-6 md:p-8 rounded-[2rem] shadow-soft border border-slate-100 dark:border-slate-800 gap-6 md:gap-8 theme-transition hover:shadow-premium relative">
              <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-soft">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow space-y-1 md:space-y-2 text-center sm:text-left">
                <h3 className="text-xl md:text-2xl font-black text-secondary-900 dark:text-white tracking-tight">{item.name}</h3>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-secondary-400">{item.category}</p>
                <p className="text-primary-500 font-black text-xl md:text-2xl">${item.price}</p>
              </div>
              
              <div className="flex items-center space-x-4 md:space-x-6 bg-slate-50 dark:bg-secondary-900 p-2 md:p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white dark:bg-secondary-800 rounded-xl shadow-soft hover:text-primary-500 transition-colors text-secondary-600 dark:text-slate-300 font-bold"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 md:w-8 text-center text-lg md:text-xl font-black text-secondary-900 dark:text-white">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white dark:bg-secondary-800 rounded-xl shadow-soft hover:text-primary-500 transition-colors text-secondary-600 dark:text-slate-300 font-bold"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button 
                onClick={() => dispatch(removeFromCart(item.id))}
                className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-3 md:p-4 text-secondary-300 hover:text-red-500 transition-colors rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <Trash2 className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-app-surface-dark p-10 rounded-[2.5rem] shadow-premium border border-slate-100 dark:border-slate-800 sticky top-28 space-y-10">
            <h2 className="text-2xl font-black text-secondary-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-800 pb-6 uppercase text-center tracking-[0.2em] text-xs">Summary</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between text-secondary-500 dark:text-secondary-400 font-bold">
                <span>Subtotal</span>
                <span className="text-secondary-900 dark:text-white font-black">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-secondary-500 dark:text-secondary-400 font-bold">
                <span>Delivery Fee</span>
                <span className="text-secondary-900 dark:text-white font-black">$2.50</span>
              </div>
              <div className="flex justify-between text-secondary-500 dark:text-secondary-400 font-bold">
                <span>Tax (5%)</span>
                <span className="text-secondary-900 dark:text-white font-black">${(totalAmount * 0.05).toFixed(2)}</span>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex justify-between items-center">
                <span className="text-lg font-black text-secondary-900 dark:text-white uppercase tracking-widest">Total</span>
                <span className="text-4xl font-black text-primary-500">
                  ${(totalAmount + 2.50 + totalAmount * 0.05).toFixed(2)}
                </span>
              </div>
            </div>

            <Button onClick={() => navigate('/checkout')} className="w-full py-5 text-xl shadow-glow">
              Secure Checkout <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            
            <div className="text-center">
              <Link to="/menu" className="text-sm text-secondary-400 hover:text-primary-500 transition-colors font-black uppercase tracking-widest underline underline-offset-8 decoration-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
