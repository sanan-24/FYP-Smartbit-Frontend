import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingCart, Heart, Search, Menu, X,
  LogOut, User, ClipboardList, Home as HomeIcon, LayoutGrid,
} from 'lucide-react';
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

  React.useEffect(() => { setIsOpen(false); }, [pathname]);

  const isAuthPage = normalizedPath === '/login' || normalizedPath === '/signup';
  const guestCta = normalizedPath === '/signup'
    ? { to: '/login', label: 'Login' }
    : { to: '/signup', label: 'Sign Up' };

  const getImageUrl = (path) => {
    if (!path) return null;
    let cleanPath = path.trim().replace(/^`|`$/g, '').replace(/\\/g, '/');
    if (cleanPath.startsWith('http')) return cleanPath;
    let baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1/').replace(/\/api\/v1\/?$/, '');
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${base}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await dispatch(logoutUser());
    navigate('/login');
  };

  const isActive = (path) => path === '/' ? normalizedPath === '/' : normalizedPath === path;

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/menu', label: 'Menu', icon: LayoutGrid },
    ...(isAuthenticated ? [
      { to: '/orders', label: 'My Orders', icon: ClipboardList },
      { to: '/favorites', label: 'Favorites', icon: Heart, badge: favorites.length },
      { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: totalQuantity },
      { to: '/profile', label: 'Profile', icon: User },
    ] : []),
  ];

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">

            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.jpg" alt="Smart Bite" className="h-10 w-auto rounded-full" />
                <span className="text-2xl font-black text-gray-900 tracking-tighter hidden sm:block">Smart Bite</span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-10">
              {[{ to: '/', label: 'Home' }, { to: '/menu', label: 'Menu' }, ...(isAuthenticated ? [{ to: '/orders', label: 'Orders' }] : [])].map(({ to, label }) => (
                <Link key={to} to={to} className={`font-bold transition-colors ${isActive(to) ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'}`}>{label}</Link>
              ))}

              <div className="relative group">
                <input type="text" placeholder="Search cravings..." className="bg-gray-50 border border-gray-200 rounded-2xl py-2.5 px-5 pl-12 w-64 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                <Search className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
              </div>

              <div className={`flex items-center space-x-4 ${isAuthenticated ? 'border-l border-gray-200 pl-8' : ''}`}>
                {isAuthenticated && !isAuthPage && (
                  <>
                    <Link to="/favorites" className="relative p-2.5 rounded-2xl bg-gray-50 text-gray-600 hover:bg-primary-500 hover:text-white transition-all">
                      <Heart className="h-5 w-5" />
                      {favorites.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">{favorites.length}</span>}
                    </Link>
                    <Link to="/cart" className="relative p-2.5 rounded-2xl bg-gray-50 text-gray-600 hover:bg-primary-500 hover:text-white transition-all">
                      <ShoppingCart className="h-5 w-5" />
                      {totalQuantity > 0 && <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">{totalQuantity}</span>}
                    </Link>
                  </>
                )}
                {isAuthenticated ? (
                  <div className="relative group">
                    <Link to="/profile" className="flex items-center space-x-3 p-1.5 pr-4 rounded-full bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200 shadow-sm">
                      <div className="w-9 h-9 rounded-full bg-primary-500 overflow-hidden border-2 border-white flex items-center justify-center">
                        {user?.profilePhoto ? <img src={getImageUrl(user.profilePhoto)} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-white font-black text-sm">{user?.firstName?.charAt(0) || user?.email?.charAt(0)}</span>}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Profile</span>
                        <span className="text-sm font-black text-gray-900 truncate max-w-[100px]">{user?.firstName || user?.email?.split('@')[0]}</span>
                      </div>
                    </Link>
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                        <Link to="/profile" className="flex items-center space-x-3 px-5 py-4 hover:bg-gray-50 text-gray-700"><User className="w-4 h-4" /><span className="text-sm font-bold">My Profile</span></Link>
                        <Link to="/orders" className="flex items-center space-x-3 px-5 py-4 hover:bg-gray-50 text-gray-700 border-t border-gray-100"><ClipboardList className="w-4 h-4" /><span className="text-sm font-bold">My Orders</span></Link>
                        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-5 py-4 hover:bg-red-50 text-red-600 border-t border-gray-100"><LogOut className="w-4 h-4" /><span className="text-sm font-bold">Logout</span></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => navigate(guestCta.to)} className="btn-primary py-2.5 px-8 text-sm">{guestCta.label}</button>
                )}
              </div>
            </div>

            {/* Mobile Top-Right */}
            <div className="lg:hidden flex items-center space-x-3">
              {isAuthenticated && !isAuthPage && (
                <Link to="/cart" className="relative p-2 rounded-xl bg-gray-50 text-gray-600">
                  <ShoppingCart className="h-5 w-5" />
                  {totalQuantity > 0 && <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center">{totalQuantity}</span>}
                </Link>
              )}
              {!isAuthenticated && isAuthPage ? (
                <button onClick={() => navigate(guestCta.to)} className="btn-primary py-2 px-6 text-[10px] uppercase font-black tracking-widest">{guestCta.label}</button>
              ) : (
                <button onClick={() => setIsOpen(true)} className="p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all">
                  <Menu className="h-6 w-6" />
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer (rendered outside nav, at root level) ── */}
      {isOpen && (
        <div className="lg:hidden" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div style={{
            position: 'absolute', top: 0, right: 0, height: '100%',
            width: '80%', maxWidth: '320px',
            backgroundColor: '#ffffff',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            zIndex: 10000,
          }}>
            {/* Header */}
            <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f3f4f6', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.jpg" alt="Smart Bite" style={{ height: '36px', borderRadius: '50%' }} />
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#111827', letterSpacing: '-0.5px' }}>Smart Bite</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ padding: '8px', borderRadius: '12px', backgroundColor: '#f3f4f6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={20} color="#374151" />
              </button>
            </div>

            {/* Nav Links */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#ffffff' }}>
              <p style={{ fontSize: '9px', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '3px', padding: '0 12px', marginBottom: '8px' }}>Navigation</p>

              {navLinks.map(({ to, label, icon: Icon, badge }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px', borderRadius: '16px', marginBottom: '4px',
                    textDecoration: 'none', fontWeight: 700, fontSize: '14px',
                    backgroundColor: isActive(to) ? 'rgba(22,163,74,0.08)' : 'transparent',
                    color: isActive(to) ? '#15803d' : '#374151',
                  }}
                >
                  <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: isActive(to) ? 'rgba(22,163,74,0.12)' : '#f3f4f6', display: 'flex' }}>
                    <Icon size={18} color={isActive(to) ? '#15803d' : '#6b7280'} />
                  </div>
                  <span style={{ flex: 1 }}>{label}</span>
                  {badge > 0 && (
                    <span style={{ backgroundColor: '#f97316', color: '#fff', fontSize: '9px', fontWeight: 900, borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>
                  )}
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px', borderTop: '1px solid #f3f4f6', backgroundColor: '#f9fafb', flexShrink: 0 }}>
              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link to="/profile" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', backgroundColor: '#ffffff', border: '1px solid #f3f4f6', textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f97316', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      {user?.profilePhoto
                        ? <img src={getImageUrl(user.profilePhoto)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ color: '#fff', fontWeight: 900, fontSize: '16px' }}>{user?.firstName?.charAt(0) || user?.email?.charAt(0)}</span>
                      }
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 900, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.firstName} {user?.lastName}</p>
                      <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                    </div>
                  </Link>
                  <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '16px', backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 900, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Link to="/login" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', borderRadius: '16px', backgroundColor: '#f3f4f6', color: '#111827', fontWeight: 900, fontSize: '14px', textDecoration: 'none' }}>Login</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', borderRadius: '16px', backgroundColor: '#f97316', color: '#fff', fontWeight: 900, fontSize: '14px', textDecoration: 'none' }}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
