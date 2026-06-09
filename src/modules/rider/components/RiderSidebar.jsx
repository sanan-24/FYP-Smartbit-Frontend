import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bike, 
  History,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../features/authSlice';

const RiderSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/rider/dashboard' },
    { icon: Bike, label: 'Active Orders', path: '/rider/orders' },
    { icon: History, label: 'History', path: '/rider/history' },
    { icon: Settings, label: 'Settings', path: '/rider/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`lg:hidden fixed inset-0 bg-secondary-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      ></div>

      <aside className={`fixed lg:sticky top-0 left-0 w-64 md:w-72 bg-secondary-950 text-white h-screen flex flex-col shadow-2xl z-[70] border-r border-white/5 transition-transform duration-300 transform flex-shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Smart Bite" className="h-8 md:h-10 w-auto rounded-full" />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black text-white tracking-tighter leading-none">Smart Bite</span>
              <span className="text-[8px] md:text-[10px] text-primary-500 font-black uppercase tracking-widest mt-1">Rider</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden p-2 rounded-xl bg-white/5 text-secondary-400 active:scale-90">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-grow py-6 md:py-8 px-4 md:px-5 space-y-1.5 md:space-y-2 overflow-y-auto">
          <p className="px-4 text-[9px] md:text-[10px] font-black text-secondary-500 uppercase tracking-[0.3em] mb-4">Rider Panel</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className={`flex items-center space-x-3 md:space-x-4 p-3.5 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 translate-x-1' 
                    : 'text-secondary-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-secondary-500 group-hover:text-primary-400'}`} />
                <span className="font-bold text-xs md:text-sm tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 md:p-8 border-t border-white/5 bg-secondary-950/50">
          <button
            onClick={() => dispatch(logoutUser())}
            className="flex items-center space-x-3 md:space-x-4 w-full p-3.5 md:p-4 rounded-xl md:rounded-2xl text-secondary-500 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group"
          >
            <div className="p-2 rounded-lg md:rounded-xl bg-white/5 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <span className="font-bold text-xs md:text-sm tracking-tight">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default RiderSidebar;

