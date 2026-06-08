import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { setCategory, setSearchQuery, fetchCategories, fetchProducts } from '../features/productSlice';
import ProductCard from '../components/ProductCard';

const Menu = () => {
  const { filteredItems, categories, selectedCategory, searchQuery, loading } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12 md:space-y-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 md:gap-12">
        <div className="space-y-4 md:space-y-6 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black text-secondary-950 dark:text-white tracking-tighter leading-none">
            Our <span className="text-primary-500 italic">Signature</span> Menu
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 text-lg md:text-xl font-medium leading-relaxed">
            From artisanal starters to decadent desserts, explore our curated selection of gourmet masterpieces.
          </p>
        </div>
        
        <div className="relative w-full lg:w-96 group">
          <input
            type="text"
            placeholder="Search our menu..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-white dark:bg-secondary-900 border-2 border-slate-100 dark:border-white/5 rounded-3xl py-4 md:py-5 px-12 md:px-14 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-secondary-900 dark:text-white transition-all font-bold shadow-soft group-hover:shadow-md"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-6 scrollbar-hide">
        <div className="flex-shrink-0 bg-white dark:bg-secondary-900 p-3 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800">
          <Filter className="h-6 w-6 text-primary-500" />
        </div>
        
        {/* 'All' Category */}
        <button
          onClick={() => dispatch(setCategory('All'))}
          className={`flex-shrink-0 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
            selectedCategory === 'All'
              ? 'bg-primary-500 text-white shadow-glow translate-y-[-2px]'
              : 'bg-white dark:bg-secondary-900 text-secondary-500 dark:text-secondary-400 hover:bg-slate-50 dark:hover:bg-secondary-800 shadow-soft border border-slate-100 dark:border-slate-800'
          }`}
        >
          All
        </button>

        {/* Dynamic Categories */}
        {loading && categories.length === 0 ? (
          <div className="flex items-center space-x-2 px-8 py-3 text-secondary-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-bold text-sm uppercase tracking-widest">Loading...</span>
          </div>
        ) : (
          categories.map((category) => (
            <button
              key={category._id}
              onClick={() => dispatch(setCategory(category.name))}
              className={`flex-shrink-0 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                selectedCategory === category.name
                  ? 'bg-primary-500 text-white shadow-glow translate-y-[-2px]'
                  : 'bg-white dark:bg-secondary-900 text-secondary-500 dark:text-secondary-400 hover:bg-slate-50 dark:hover:bg-secondary-800 shadow-soft border border-slate-100 dark:border-slate-800'
              }`}
            >
              {category.name}
            </button>
          ))
        )}
      </div>

      {/* Results Count & Filter Info */}
      <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
        <p className="text-secondary-400 font-bold uppercase tracking-widest text-xs">
          Showing <span className="text-secondary-900 dark:text-white">{filteredItems.length}</span> signature results
        </p>
        <button className="flex items-center text-primary-600 dark:text-primary-400 font-black text-sm hover:underline underline-offset-4 decoration-2">
          <SlidersHorizontal className="h-4 w-4 mr-2" /> Refine Search
        </button>
      </div>

      {/* Product Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredItems.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 space-y-6">
          <div className="bg-slate-50 dark:bg-secondary-900 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-soft">
            <Search className="h-10 w-10 text-secondary-300" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-secondary-900 dark:text-white">No flavors found</h3>
            <p className="text-secondary-500 dark:text-secondary-400 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
          <button 
            onClick={() => {
              dispatch(setCategory('All'));
              dispatch(setSearchQuery(''));
            }}
            className="text-primary-500 font-black hover:underline underline-offset-8 decoration-2"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
