import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../features/productSlice';

const Home = () => {
  const { filteredItems } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center px-4 overflow-hidden bg-secondary-950">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-950 via-secondary-950/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 md:py-0">
          <div className="max-w-3xl space-y-6 md:space-y-10 text-center sm:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-primary-400 text-[10px] sm:text-sm font-bold uppercase tracking-widest"
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              <span>Premium Food Delivery</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter"
            >
              Elevate Your <br />
              <span className="text-primary-500 italic">Dining</span> Experience
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-secondary-100/70 text-base sm:text-xl md:text-2xl max-w-xl leading-relaxed mx-auto sm:mx-0"
            >
              Discover the city's most exquisite flavors, curated and delivered with absolute precision to your doorstep.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            >
              <Link 
                to="/menu" 
                className="w-full sm:w-auto bg-primary-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-primary-600 transition-all shadow-2xl shadow-primary-500/30 flex items-center justify-center group"
              >
                Order Now <ChevronRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-white/10 transition-all">
                View Gallery
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Chef's <span className="text-primary-600 dark:text-primary-500">Selections</span></h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-lg">Hand-picked seasonal favorites that define our commitment to culinary excellence.</p>
          </div>
          <Link to="/menu" className="group flex items-center text-secondary-900 dark:text-primary-500 font-black text-base md:text-lg hover:underline underline-offset-8 decoration-4">
            Explore Full Menu <ChevronRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {filteredItems.slice(0, 4).map((item) => (
            <ProductCard key={item._id || item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-50 dark:bg-secondary-900/50 py-20 md:py-32 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter">The <span className="text-primary-600 dark:text-primary-500">Smart Bite</span> Standard</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl">We don't just deliver food; we deliver a promise of quality, speed, and absolute satisfaction.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {[
              { icon: Clock, title: "Elite Speed", desc: "Our logistics network ensures your meal arrives within 30 minutes, maintaining perfect temperature." },
              { icon: Star, title: "Premium Quality", desc: "We partner exclusively with top-rated establishments that share our passion for fresh ingredients." },
              { icon: MapPin, title: "Concierge Tracking", desc: "Experience peace of mind with real-time tracking and dedicated support for every single order." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-app-surface-dark p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-soft hover:shadow-premium transition-all group">
                <div className="bg-primary-50 dark:bg-primary-900/20 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 group-hover:rotate-6 transition-transform">
                  <feature.icon className="h-8 w-8 md:h-10 md:w-10 text-primary-600 dark:text-primary-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 dark:text-white">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm md:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
