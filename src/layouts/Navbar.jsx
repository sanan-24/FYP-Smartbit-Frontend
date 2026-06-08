import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Heart, Search, Menu, X, LogOut, User, ClipboardList, Home as HomeIcon, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { logoutUser } from '../features/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { items: favorites } = useSelector((state) => state.favorites);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const normalizedPath = pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname;

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isAuthPage = normalizedPath === '/login' || normalizedPath === '/signup';
  const guestCta = normalizedPath === '/signup'
    ? { to: '/login', label: 'Login' }
    : { to: '/signup', label: 'Sign Up' };

  // Helper to format image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    
    let cleanPath = path.trim().replace(/^`|`$/g, '');
    cleanPath = cleanPath.replace(/\\/g, '/');
    
    if (cleanPath.startsWith('http')) return cleanPath;
    
    let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1/';
    baseUrl = baseUrl.replace(/\/api\/v1\/?$/, ''); 
    
    const finalBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    // If path doesn't start with a slash and doesn't look like it has a folder, 
    // it might be in an 'uploads' or 'public' folder that isn't in the path string
    let finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    
    return `${finalBaseUrl}${finalPath}`;
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="bg-app-surface-light/90 backdrop-blur-xl border-b border-app-border-light sticky top-0 z-50 theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Smart Bite" className="h-10 w-auto rounded-full" />
              <span className="text-2xl font-black text-secondary-900 tracking-tighter hidden sm:block">Smart Bite</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link to="/" className="text-secondary-600 font-bold hover:text-primary-500 transition-colors">Home</Link>
            <Link to="/menu" className="text-secondary-600 font-bold hover:text-primary-500 transition-colors">Menu</Link>
            {isAuthenticated && (
              <Link to="/orders" className="text-secondary-600 font-bold hover:text-primary-500 transition-colors">Orders</Link>
            )}
            
            <div className="relative group">
              <input
                type="text"
                placeholder="Search cravings..."
                className="bg-secondary-50 border border-app-border-light rounded-2xl py-2.5 px-5 pl-12 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-300 w-64 text-secondary-900 theme-transition font-medium"
              />
              <Search className="absolute left-4 top-3 h-4 w-4 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
            </div>

            <div className={`flex items-center space-x-4 ${isAuthPage ? '' : (isAuthenticated ? 'border-l border-app-border-light pl-8' : '')}`}>
              {isAuthenticated && !isAuthPage && (
                <>
                  <Link to="/favorites" className="relative p-2.5 rounded-2xl bg-secondary-50 text-secondary-600 hover:bg-primary-500 hover:text-white transition-all">
                    <Heart className="h-5 w-5" />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                        {favorites.length}
                      </span>
                    )}
                  </Link>

                  <Link to="/cart" className="relative p-2.5 rounded-2xl bg-secondary-50 text-secondary-600 hover:bg-primary-500 hover:text-white transition-all">
                    <ShoppingCart className="h-5 w-5" />
                    {totalQuantity > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-secondary-900 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                        {totalQuantity}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {isAuthenticated ? (
                <div className="relative group">
                  <Link to="/profile" className="flex items-center space-x-3 p-1.5 pr-4 rounded-full bg-secondary-50 hover:bg-secondary-100 transition-all border border-app-border-light shadow-sm hover:shadow-md">
                    <div className="w-9 h-9 rounded-full bg-primary-500 overflow-hidden border-2 border-white flex items-center justify-center">
                      {user?.profilePhoto ? (
                        <img src={getImageUrl(user.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-black text-sm">
                          {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-start -space-y-0.5">
                      <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Profile</span>
                      <span className="text-sm font-black text-secondary-900 truncate max-w-[100px]">
                        {user?.firstName || user?.email?.split('@')[0]}
                      </span>
                    </div>
                  </Link>
                  
                  {/* Dropdown Menu on Hover */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="w-48 bg-app-surface-light rounded-2xl shadow-2xl border border-app-border-light overflow-hidden">
                      <Link to="/profile" className="flex items-center space-x-3 px-5 py-4 hover:bg-secondary-50 text-secondary-700 transition-colors">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-bold">My Profile</span>
                      </Link>
                      <Link to="/orders" className="flex items-center space-x-3 px-5 py-4 hover:bg-secondary-50 text-secondary-700 transition-colors border-t border-secondary-100">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm font-bold">My Orders</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-red-50 text-red-600 transition-colors border-t border-secondary-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-bold">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate(guestCta.to)}
                  className="btn-primary py-2.5 px-8 text-sm"
                >
                  {guestCta.label}
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            {isAuthenticated && !isAuthPage && (
              <Link to="/cart" className="relative p-2 rounded-xl bg-secondary-50 text-secondary-600">
                <ShoppingCart className="h-5 w-5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary-900 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            )}
            
            {!isAuthenticated && isAuthPage ? (
              <button
                onClick={() => navigate(guestCta.to)}
                className="btn-primary py-2 px-6 text-[10px] uppercase font-black tracking-widest"
              >
                {guestCta.label}
              </button>
            ) : (
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 rounded-xl bg-secondary-50 text-secondary-700 hover:bg-secondary-100 transition-all"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
        
        {/* Menu Content */}
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-6 flex justify-between items-center border-b border-secondary-50">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Smart Bite" className="h-8 w-auto rounded-full" />
              <span className="text-xl font-black text-secondary-900 tracking-tighter">Smart Bite</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-secondary-50 text-secondary-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6">
            <div className="space-y-1">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-secondary-50 text-secondary-700 font-bold transition-all">
                <div className="p-2 rounded-lg bg-secondary-100"><HomeIcon size={18} /></div>
                <span>Home</span>
              </Link>
              <Link to="/menu" onClick={() => setIsOpen(false)} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-secondary-50 text-secondary-700 font-bold transition-all">
                <div className="p-2 rounded-lg bg-secondary-100"><LayoutGrid size={18} /></div>
                <span>Menu</span>
              </Link>
              {isAuthenticated && (
                <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-secondary-50 text-secondary-700 font-bold transition-all">
                  <div className="p-2 rounded-lg bg-secondary-100"><ClipboardList size={18} /></div>
                  <span>My Orders</span>
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/favorites" onClick={() => setIsOpen(false)} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-secondary-50 text-secondary-700 font-bold transition-all">
                  <div className="p-2 rounded-lg bg-secondary-100"><Heart size={18} /></div>
                  <span>Favorites</span>
                </Link>
              )}
              
              <div className="pt-4 px-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search cravings..."
                    className="w-full bg-secondary-50 border border-secondary-100 rounded-2xl py-3.5 px-12 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-secondary-100 bg-slate-50/50">
            {isAuthenticated ? (
              <div className="space-y-4">
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center space-x-4 p-3 rounded-2xl bg-white border border-secondary-100 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-500 overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                    {user?.profilePhoto ? (
                      <img src={getImageUrl(user.profilePhoto)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-black">{user?.firstName?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-secondary-900">{user?.firstName}</p>
                    <p className="text-[10px] text-secondary-500 font-bold uppercase tracking-widest">{user?.role}</p>
                  </div>
                </Link>
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full flex items-center justify-center space-x-3 py-4 rounded-2xl bg-red-50 text-red-600 font-black text-sm transition-all active:scale-95"
                >
                  <LogOut size={20} /> <span>Logout System</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 rounded-2xl bg-secondary-100 text-secondary-900 font-black text-sm">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 rounded-2xl bg-primary-500 text-white font-black text-sm shadow-lg shadow-primary-500/20">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
