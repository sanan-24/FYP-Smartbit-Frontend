import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useSelector } from 'react-redux';
import { Bell, Menu as MenuIcon } from 'lucide-react';

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper to format image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    
    let cleanPath = path.trim().replace(/^`|`$/g, '');
    cleanPath = cleanPath.replace(/\\/g, '/');
    
    if (cleanPath.startsWith('http')) return cleanPath;
    
    let baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1/';
    baseUrl = baseUrl.replace(/\/api\/v1\/?$/, ''); 
    
    const finalBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    let finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    
    return `${finalBaseUrl}${finalPath}`;
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-secondary-950 transition-colors duration-500 overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Admin Topbar */}
        <header className="h-16 md:h-24 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-3 md:px-10 flex-shrink-0 z-40">
          <div className="flex items-center space-x-3 md:space-x-4 flex-grow lg:flex-grow-0">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-secondary-950 text-secondary-600 dark:text-secondary-400 active:scale-90 transition-transform"
            >
              <MenuIcon size={20} className="md:size-6" />
            </button>
            {/* Mobile Title */}
            <div className="md:hidden">
              <h2 className="text-lg font-black dark:text-white tracking-tight">Admin</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-8">
            <button className="relative p-2 md:p-3 text-secondary-400 hover:text-primary-500 hover:bg-primary-500/5 rounded-xl md:rounded-2xl transition-all group">
              <Bell className="h-5 w-5 md:h-6 md:w-6 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-1.5 right-1.5 md:top-3 md:right-3 w-2 md:w-2.5 h-2 md:h-2.5 bg-primary-500 rounded-full border-2 border-white dark:border-secondary-900"></span>
            </button>
            
            <div className="flex items-center space-x-3 md:space-x-5 border-l pl-3 md:pl-8 border-slate-100 dark:border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-secondary-900 dark:text-white tracking-tight leading-none">{user?.firstName || user?.name || 'Admin'}</p>
                <p className="text-[9px] text-primary-500 uppercase font-black tracking-[0.2em] mt-1">System Admin</p>
              </div>
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-secondary-900 dark:bg-secondary-800 border-2 border-white dark:border-secondary-700 shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.profilePhoto ? (
                  <img src={getImageUrl(user.profilePhoto)} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-black text-sm md:text-base">{user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'A'}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-grow overflow-y-auto p-3 md:p-10">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
