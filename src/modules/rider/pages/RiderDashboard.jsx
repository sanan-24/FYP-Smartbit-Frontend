import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Navigation, 
  CheckCircle,
  Package,
  Clock,
  Bike,
  Loader2,
  DollarSign,
  TrendingUp,
  History,
  RefreshCcw,
  Phone,
  Star
} from 'lucide-react';
import { updateOrderStatusRider, fetchAssignedOrders, toggleRiderAvailability, fetchRiderStats, updateRiderLocation } from '../redux/riderSlice';
import Button from '../../../components/Button';
import socketService from '../../../api/socket';
import NotificationModal from '../../../components/NotificationModal';
import LiveTrackingMap from '../../../components/LiveTrackingMap';

const RiderDashboard = () => {
  const { assignedOrders, riderStats, loading, error, isAvailable } = useSelector((state) => state.rider);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [activeMapOrderId, setActiveMapOrderId] = useState(null);

  // Sync isAvailable with user profile on mount
  useEffect(() => {
    dispatch(fetchAssignedOrders());
    dispatch(fetchRiderStats());

    // Listen for real-time order assignments
    socketService.on('new_order_assigned', (data) => {
      console.log("New order assigned:", data);
      dispatch(fetchAssignedOrders());
      dispatch(fetchRiderStats());
      
      setNotification({
        isOpen: true,
        title: 'New Order!',
        message: data.message || 'A new order has been assigned to you. Get ready for delivery!',
        type: 'order'
      });
    });

    // Listen for status updates (e.g., if admin changes something)
    socketService.on('order_status_update', () => {
      dispatch(fetchAssignedOrders());
      dispatch(fetchRiderStats());
    });

    return () => {
      socketService.off('new_order_assigned');
      socketService.off('order_status_update');
    };
  }, [dispatch]);

  const handleNavigate = (orderId) => {
    setActiveMapOrderId(activeMapOrderId === orderId ? null : orderId);
  };

  const handleToggleOnline = () => {
    const targetState = !isAvailable;
    dispatch(toggleRiderAvailability(targetState));
  };

  const handleStatusUpdate = (id, status) => {
    dispatch(updateOrderStatusRider({ id, status }));
  };

  const statsData = [
    { title: "Today's Earnings", value: `Rs. ${riderStats.todayEarnings || 0}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { title: "Total Earnings", value: `Rs. ${riderStats.totalEarnings || 0}`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { title: "Completed Orders", value: riderStats.completedOrders || 0, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { title: "Average Rating", value: riderStats.averageRating > 0 ? `${riderStats.averageRating} (${riderStats.numReviews} Reviews)` : 'No Reviews', icon: Star, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  ];

  if (loading && assignedOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-500 font-medium font-bold">Loading assigned orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-10 pb-20 px-3 md:px-0">
      {/* Notification Modal */}
      <NotificationModal 
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {/* Header & Status Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 bg-white dark:bg-secondary-900 p-5 md:p-10 rounded-[1.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary-500/10 transition-colors duration-700"></div>
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="text-2xl md:text-5xl font-black dark:text-white tracking-tight leading-tight">Rider Dashboard</h1>
          <p className="text-secondary-400 mt-1.5 font-bold uppercase tracking-widest text-[8px] md:text-xs flex items-center justify-center lg:justify-start">
            <span className="hidden md:block w-6 md:w-8 h-[1px] bg-primary-500 mr-3"></span>
            Manage your daily deliveries and earnings
          </p>
        </div>
        
        <div className="flex flex-row items-center gap-2 md:gap-6 relative z-10 w-full lg:w-auto">
          <button 
            onClick={handleToggleOnline}
            disabled={loading}
            className={`flex-grow lg:flex-none flex items-center justify-center space-x-2 md:space-x-4 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-[2rem] font-black text-[10px] md:text-xs tracking-[0.1em] md:tracking-[0.2em] transition-all duration-500 transform active:scale-95 shadow-lg ${
              isAvailable 
              ? 'bg-green-500 text-white shadow-green-500/20' 
              : 'bg-slate-100 dark:bg-secondary-800 text-secondary-400 dark:text-secondary-500'
            }`}
          >
            <div className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-secondary-400'}`}></div>
            <span>{isAvailable ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="p-3 md:p-4 bg-slate-50 dark:bg-secondary-800 rounded-xl md:rounded-2xl hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-sm group"
          >
            <RefreshCcw className="h-4 w-4 md:h-5 md:w-5 group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-secondary-900 p-4 md:p-8 rounded-[1.25rem] md:rounded-[2.5rem] shadow-lg shadow-slate-200/30 dark:shadow-none border border-slate-100 dark:border-white/5 flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-5 group hover:translate-y-[-5px] transition-all duration-500">
            <div className={`${stat.bg} ${stat.color} p-3 md:p-5 rounded-lg md:rounded-[1.5rem] group-hover:scale-110 transition-all duration-500 shadow-inner`}>
              <stat.icon className="h-5 w-5 md:h-8 md:w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[7px] md:text-[10px] font-black text-secondary-400 uppercase tracking-[0.1em] md:tracking-[0.2em] mb-0.5 md:mb-1 truncate">{stat.title}</p>
              <p className="text-sm md:text-3xl font-black dark:text-white tracking-tight truncate">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Orders Section */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-500/10 rounded-lg md:rounded-xl flex items-center justify-center">
              <Bike className="h-4 w-4 md:h-5 md:w-5 text-primary-500" />
            </div>
            <h2 className="text-lg md:text-3xl font-black dark:text-white tracking-tight">Active Tasks</h2>
          </div>
          <span className="px-2.5 py-1 bg-primary-500 text-white text-[8px] md:text-[10px] font-black rounded-full shadow-lg shadow-primary-500/30 uppercase tracking-wider">
            {assignedOrders.length} {assignedOrders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {assignedOrders.length > 0 ? assignedOrders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden group">
              {/* Card Header */}
              <div className="p-4 md:p-8 border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                    <Package className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-xl font-black dark:text-white">#{order._id.slice(-6).toUpperCase()}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-black uppercase tracking-wider rounded">
                        {order.status}
                      </span>
                      <span className="text-[9px] text-secondary-400 font-bold flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 15m ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg md:text-2xl font-black text-secondary-500">Rs. {order.totalAmount || order.total}</p>
                  <p className="text-[8px] font-black text-secondary-400 uppercase tracking-widest">{order.paymentMethod === 'cash' ? 'Cash' : 'Paid'}</p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 md:p-8 space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-secondary-400 uppercase tracking-widest mb-0.5">Drop-off Location</p>
                      <p className="text-xs md:text-base font-bold dark:text-white leading-snug">{order.address}</p>
                      <p className="text-[10px] text-secondary-400 mt-0.5">{order.city}, {order.postalCode}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 md:p-4 bg-slate-50 dark:bg-white/5 rounded-xl md:rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-secondary-800 flex items-center justify-center font-black text-secondary-500 text-[10px] md:text-xs">
                        {order.firstName?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-black dark:text-white truncate">{order.firstName} {order.lastName}</p>
                        <p className="text-[9px] md:text-[10px] font-bold text-secondary-400">{order.phoneNumber}</p>
                      </div>
                    </div>
                    <a href={`tel:${order.phoneNumber}`} className="w-8 h-8 md:w-10 md:h-10 bg-primary-500 text-white rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 active:scale-90 transition-transform">
                      <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" className="flex items-center justify-center py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest border-2">
                    <Navigation className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" /> Directions
                  </Button>
                  {order.status !== 'delivered' && (
                    <Button 
                      onClick={() => handleStatusUpdate(order._id, 'delivered')}
                      loading={loading}
                      className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 border-none"
                    >
                      <CheckCircle className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" /> Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-12 md:py-20 text-center space-y-4 md:space-y-6 bg-white dark:bg-secondary-900 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-white/5">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto">
                <Package className="h-8 w-8 md:h-10 md:w-10 text-secondary-300" />
              </div>
              <div className="max-w-xs mx-auto px-4">
                <p className="text-lg md:text-xl font-black dark:text-white">No active tasks</p>
                <p className="text-[10px] md:text-xs text-secondary-400 font-bold mt-2 leading-relaxed uppercase tracking-wider">New orders will appear here automatically</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Table (Mobile Optimized) */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary-100 dark:bg-secondary-800 rounded-lg md:rounded-xl flex items-center justify-center">
              <History className="h-4 w-4 md:h-5 md:w-5 text-secondary-500" />
            </div>
            <h2 className="text-lg md:text-3xl font-black dark:text-white tracking-tight">Activity Log</h2>
          </div>
          <Link to="/rider/history" className="text-[9px] md:text-[10px] font-black text-primary-500 uppercase tracking-widest bg-primary-500/5 px-3 py-1.5 rounded-full">
            Full History
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-secondary-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-50 dark:border-white/5">
                  <th className="px-6 py-5 text-[9px] font-black text-secondary-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-5 text-[9px] font-black text-secondary-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-5 text-[9px] font-black text-secondary-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-5 text-[9px] font-black text-secondary-400 uppercase tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {assignedOrders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                    <td className="px-6 py-4">
                      <span className="font-black text-primary-500 text-xs">#{order._id.slice(-4).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-secondary-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold dark:text-white text-xs">{order.firstName}</span>
                        <span className="text-[8px] font-black text-secondary-400 uppercase">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black dark:text-white text-xs">Rs. {order.totalAmount || order.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View (Activity Log) */}
        <div className="md:hidden space-y-3">
          {assignedOrders.slice(0, 5).map((order) => (
            <div key={order._id} className="bg-white dark:bg-secondary-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-50 dark:bg-secondary-800 rounded-xl flex items-center justify-center font-black text-primary-500 text-[10px]">
                  #{order._id.slice(-4).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-black dark:text-white">{order.firstName}</p>
                  <p className="text-[9px] font-bold text-secondary-400 uppercase tracking-tighter">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black dark:text-white">Rs. {order.totalAmount || order.total}</p>
                <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${
                  order.status === 'delivered' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
