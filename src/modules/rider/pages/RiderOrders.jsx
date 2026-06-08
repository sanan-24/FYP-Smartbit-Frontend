import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Package, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  CheckCircle,
  Loader2,
  Bike,
  RefreshCcw,
  History as HistoryIcon
} from 'lucide-react';
import { updateOrderStatusRider, fetchAssignedOrders } from '../redux/riderSlice';
import Button from '../../../components/Button';
import LiveTrackingMap from '../../../components/LiveTrackingMap';
import NotificationModal from '../../../components/NotificationModal';
import socketService from '../../../api/socket';

const RiderOrders = () => {
  const { assignedOrders, loading, error } = useSelector((state) => state.rider);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [activeMapOrderId, setActiveMapOrderId] = useState(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    dispatch(fetchAssignedOrders());

    socketService.on('new_order_assigned', () => {
      dispatch(fetchAssignedOrders());
    });

    return () => {
      socketService.off('new_order_assigned');
    };
  }, [dispatch]);

  const handleNavigate = (orderId) => {
    setActiveMapOrderId(activeMapOrderId === orderId ? null : orderId);
  };

  const handleStatusUpdate = async (id, status) => {
    const result = await dispatch(updateOrderStatusRider({ id, status }));
    if (!result.error) {
      dispatch(fetchAssignedOrders());
    }
  };

  const activeOrders = assignedOrders.filter(o => !['delivered', 'cancelled'].includes(o.status));

  if (loading && activeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
        <p className="text-secondary-400 font-black uppercase tracking-widest text-xs">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 pb-20 px-3 md:px-0">
      <NotificationModal 
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
            <Package className="h-5 w-5 md:h-6 md:w-6 text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-black dark:text-white tracking-tight flex items-center">
              Active Deliveries
              <span className="ml-3 px-3 py-1 bg-primary-500 text-white text-[8px] md:text-[10px] font-black rounded-full shadow-lg shadow-primary-500/20 uppercase">
                {activeOrders.length}
              </span>
            </h2>
          </div>
        </div>
        <button 
          onClick={() => dispatch(fetchAssignedOrders())}
          className="p-3 md:p-4 bg-slate-50 dark:bg-secondary-800 rounded-xl md:rounded-2xl hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-sm group"
        >
          <RefreshCcw className={`h-4 w-4 md:h-5 md:w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-10 items-start">
        {activeOrders.length > 0 ? activeOrders.map((order) => (
          <div key={order._id} className="bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden group hover:shadow-primary-500/10 transition-all duration-700 h-fit">
            <div className="p-5 md:p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-secondary-800/30 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 md:w-2 h-full bg-primary-500"></div>
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="bg-primary-500 p-3 md:p-4 rounded-xl md:rounded-2xl text-white shadow-xl shadow-primary-500/30 group-hover:rotate-6 transition-transform duration-500">
                  <Package className="h-5 w-5 md:h-7 md:w-7" />
                </div>
                <div>
                  <h3 className="text-base md:text-2xl font-black dark:text-white tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <div className="flex items-center space-x-2 md:space-x-3 mt-0.5 md:mt-1.5">
                    <span className="px-2 md:px-4 py-0.5 md:py-1 rounded-md md:rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-sm bg-orange-100 text-orange-700">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg md:text-3xl font-black text-secondary-900 dark:text-white tracking-tighter">Rs. {order.totalAmount || order.total}</p>
                <p className="text-[8px] md:text-[10px] text-secondary-400 font-black uppercase tracking-widest mt-0.5 md:mt-1">
                  {order.paymentMethod === 'cash' ? 'Cash' : 'Paid'}
                </p>
              </div>
            </div>

            <div className="p-5 md:p-10 space-y-6 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="flex items-start space-x-4 md:space-x-5">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-inner">
                    <MapPin className="h-5 w-5 md:h-7 md:w-7 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] text-secondary-400 uppercase font-black tracking-[0.2em] mb-1 md:mb-2">Address</p>
                    <p className="font-black dark:text-white leading-tight text-sm md:text-lg tracking-tight">{order.address}</p>
                    <p className="text-[10px] md:text-sm text-secondary-500 font-bold mt-1 md:mt-2 flex items-center">
                      <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-secondary-300 rounded-full mr-2"></span>
                      {order.firstName} {order.lastName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 md:space-x-5">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-inner">
                    <Clock className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] text-secondary-400 uppercase font-black tracking-[0.2em] mb-1 md:mb-2">Arrival</p>
                    <p className="font-black dark:text-white text-lg md:text-2xl tracking-tighter">15-20 min</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 md:p-6 bg-slate-50/50 dark:bg-secondary-800/50 rounded-[1.25rem] md:rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-inner">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white dark:bg-secondary-700 shadow-md flex items-center justify-center font-black text-secondary-500 text-sm md:text-xl border border-slate-100 dark:border-white/5">
                    {order.firstName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm md:text-lg font-black dark:text-white tracking-tight">{order.firstName} {order.lastName}</p>
                    <p className="text-[10px] text-secondary-400 font-bold tracking-widest">{order.phoneNumber}</p>
                  </div>
                </div>
                <a href={`tel:${order.phoneNumber}`} className="p-3 md:p-4 bg-primary-500 text-white rounded-xl md:rounded-2xl hover:scale-110 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300">
                  <Phone className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </div>

              {activeMapOrderId === order._id && (
                <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-2 md:border-4 border-slate-50 dark:border-secondary-800 shadow-2xl animate-in zoom-in-95 duration-500">
                  <LiveTrackingMap 
                    riderId={user._id} 
                    orderId={order._id}
                    destinationAddress={order.address}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 md:gap-6 pt-2 md:pt-4">
                  {order.status !== 'out-for-delivery' ? (
                    <button 
                      onClick={() => handleStatusUpdate(order._id, 'out-for-delivery')}
                      disabled={loading}
                      className="col-span-2 flex items-center justify-center bg-primary-500 text-white py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest hover:shadow-2xl transition-all duration-300 transform active:scale-95 animate-pulse"
                    >
                      <Navigation className="mr-2 md:mr-3 h-4 w-4" />
                      Start Trip
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleNavigate(order._id)}
                        className={`flex items-center justify-center py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 border-2 ${
                          activeMapOrderId === order._id 
                          ? "bg-primary-500 text-white border-primary-500 shadow-xl shadow-primary-500/20" 
                          : "bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white border-slate-100 dark:border-white/5 hover:border-primary-500"
                        }`}
                      >
                        <Navigation className={`mr-2 md:mr-3 h-4 w-4 ${activeMapOrderId === order._id ? 'animate-pulse' : ''}`} /> 
                        Map
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                        disabled={loading}
                        className="flex items-center justify-center bg-green-500 text-white py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-widest hover:shadow-2xl transition-all duration-300 transform active:scale-95"
                      >
                        {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle className="mr-2 md:mr-3 h-4 w-4" />}
                        Deliver
                      </button>
                    </>
                  )}
                </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 md:py-32 text-center space-y-6 md:space-y-8 bg-white dark:bg-secondary-900 rounded-[2.5rem] md:rounded-[4rem] border-2 md:border-4 border-dashed border-slate-100 dark:border-white/5 shadow-inner">
            <div className="bg-slate-50 dark:bg-secondary-800 w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
              <Bike className="h-12 w-12 md:h-16 md:w-16 text-secondary-300" />
            </div>
            <div className="max-w-md mx-auto space-y-2 md:space-y-4 px-4">
              <h3 className="text-2xl md:text-4xl font-black dark:text-white tracking-tight">No Active Orders</h3>
              <p className="text-[10px] md:text-sm text-secondary-400 font-bold uppercase tracking-widest leading-relaxed">
                Stay online to receive new deliveries
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderOrders;
