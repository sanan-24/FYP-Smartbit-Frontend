import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Settings, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Power,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toggleRiderAvailability } from '../redux/riderSlice';
import Button from '../../../components/Button';

const RiderSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const { isAvailable, loading } = useSelector((state) => state.rider);
  const dispatch = useDispatch();

  const handleToggleOnline = () => {
    dispatch(toggleRiderAvailability(!isAvailable));
  };

  return (
    <div className="space-y-6 md:space-y-12 pb-20 px-3 md:px-0">
      <div className="flex items-center space-x-3 md:space-x-4 px-1">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
          <Settings className="h-5 w-5 md:h-6 md:w-6 text-primary-500" />
        </div>
        <div>
          <h2 className="text-xl md:text-3xl font-black dark:text-white tracking-tight">Rider Settings</h2>
          <p className="text-secondary-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Manage your profile and availability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Profile Info Card */}
        <div className="lg:col-span-2 bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-white/5 p-6 md:p-10 space-y-8 md:space-y-10">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-2xl md:text-4xl shadow-2xl shadow-primary-500/20">
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div>
              <h3 className="text-xl md:text-3xl font-black dark:text-white tracking-tight">{user?.name || 'Rider Partner'}</h3>
              <p className="text-secondary-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1">Delivery Professional</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-2 md:pt-4">
            <div className="space-y-1 md:space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-secondary-400 uppercase tracking-widest flex items-center">
                <Mail className="h-3 w-3 mr-2" /> Email Address
              </p>
              <p className="text-sm md:text-base font-bold dark:text-white truncate">{user?.email || 'N/A'}</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-secondary-400 uppercase tracking-widest flex items-center">
                <Phone className="h-3 w-3 mr-2" /> Phone Number
              </p>
              <p className="text-sm md:text-base font-bold dark:text-white">{user?.phoneNumber || 'Not provided'}</p>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-secondary-400 uppercase tracking-widest flex items-center">
                <Shield className="h-3 w-3 mr-2" /> Role
              </p>
              <span className="px-2.5 py-1 bg-primary-500/10 text-primary-500 text-[9px] md:text-[10px] font-black rounded-full uppercase tracking-widest w-fit block">
                {user?.role}
              </span>
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-secondary-400 uppercase tracking-widest flex items-center">
                <User className="h-3 w-3 mr-2" /> Member Since
              </p>
              <p className="text-sm md:text-base font-bold dark:text-white">{new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 dark:border-white/5 flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button variant="primary" className="rounded-xl md:rounded-2xl px-8 py-3.5 text-[10px] uppercase font-black tracking-widest">Update Profile</Button>
            <Button variant="outline" className="rounded-xl md:rounded-2xl px-8 py-3.5 text-[10px] uppercase font-black tracking-widest">Security</Button>
          </div>
        </div>

        {/* Availability Card */}
        <div className="bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-white/5 p-6 md:p-10 flex flex-col items-center text-center space-y-6 md:space-y-8">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
            isAvailable 
            ? 'bg-green-50 text-green-500 shadow-xl shadow-green-500/20 animate-pulse' 
            : 'bg-slate-50 text-secondary-300'
          }`}>
            <Power className="h-8 w-8 md:h-10 md:w-10" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black dark:text-white tracking-tight">
              {isAvailable ? 'You are Online' : 'You are Offline'}
            </h3>
            <p className="text-secondary-400 text-[10px] md:text-xs font-bold leading-relaxed px-2 md:px-4">
              {isAvailable 
                ? 'Customers can see you on the map and you will receive new orders.' 
                : 'You will not receive any new orders until you go back online.'}
            </p>
          </div>

          <button 
            onClick={handleToggleOnline}
            disabled={loading}
            className={`w-full py-4 md:py-5 rounded-xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 shadow-2xl ${
              isAvailable 
              ? 'bg-red-500 text-white shadow-red-500/30' 
              : 'bg-green-500 text-white shadow-green-500/30'
            }`}
          >
            {loading ? 'Processing...' : (isAvailable ? 'Go Offline' : 'Go Online')}
          </button>

          <div className="pt-2 md:pt-4 flex items-center space-x-2">
            {isAvailable ? (
              <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-500" />
            )}
            <span className="text-[9px] md:text-[10px] font-black text-secondary-400 uppercase tracking-widest">
              Status: {isAvailable ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderSettings;
