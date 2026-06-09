import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import RiderSidebar from './RiderSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Menu as MenuIcon } from 'lucide-react';
import { updateRiderLocation } from '../redux/riderSlice';
import socketService from '../../../api/socket';

const RiderLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const { isAvailable } = useSelector((state) => state.rider);
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Real-time Location Tracking - Centralized in Layout
  useEffect(() => {
    let watchId;
    
    const updateLocation = (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Updating rider location:", latitude, longitude);
      dispatch(updateRiderLocation({ latitude, longitude }));
      socketService.emit('update_location', {
        userId: user?._id,
        lat: latitude,
        lng: longitude
      });
    };

    if (isAvailable && "geolocation" in navigator) {
      console.log("Starting location tracking for rider...");
      
      // Kickstart: Get initial position immediately
      navigator.geolocation.getCurrentPosition(updateLocation, (err) => console.error("Initial fix error:", err));

      // Continuous tracking
      watchId = navigator.geolocation.watchPosition(
        updateLocation,
        (error) => {
          console.error("Geolocation error:", error);
        },
        { 
          enableHighAccuracy: true, 
          maximumAge: 0,
          timeout: 10000
        }
      );
    }
    return () => {
      if (watchId) {
        console.log("Stopping location tracking...");
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isAvailable, dispatch, user?._id]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-secondary-950 transition-colors duration-500 overflow-hidden">
      <RiderSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Rider Topbar */}
        <header className="h-16 md:h-24 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-4 md:px-10 flex-shrink-0 z-40">
          <div className="flex items-center space-x-3 md:space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-secondary-950 text-secondary-600 dark:text-secondary-400 active:scale-90 transition-transform"
            >
              <MenuIcon size={20} className="md:size-6" />
            </button>
            <div className="hidden sm:block h-8 md:h-10 w-1 md:w-1.5 bg-primary-500 rounded-full"></div>
            <div>
              <h2 className="text-lg md:text-2xl font-black dark:text-white tracking-tight">Rider Portal</h2>
              <p className="hidden sm:block text-[8px] md:text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">Manage deliveries</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-8">
            <div className="relative group">
              <button className="p-2 md:p-3 text-secondary-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-xl md:rounded-2xl transition-all duration-300">
                <Bell className="h-5 w-5 md:h-6 md:w-6" />
                <span className="absolute top-1.5 md:top-2.5 right-1.5 md:right-2.5 w-2 md:w-2.5 h-2 md:h-2.5 bg-primary-500 border-2 border-white dark:border-secondary-900 rounded-full"></span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-4 pl-3 md:pl-8 border-l border-slate-100 dark:border-white/10">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black dark:text-white tracking-tight">{user?.name || 'Rider'}</p>
                <div className="flex items-center justify-end space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-secondary-400 font-black uppercase tracking-widest">Active</p>
                </div>
              </div>
              <div className="relative group cursor-pointer flex-shrink-0">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-base md:text-lg shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
                  {user?.name?.charAt(0) || 'R'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 md:w-3.5 h-3 md:h-3.5 bg-green-500 border-2 border-white dark:border-secondary-900 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Rider Content Area */}
        <main className="flex-grow overflow-y-auto p-3 md:p-10">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RiderLayout;
