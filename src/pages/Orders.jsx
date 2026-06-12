import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import { fetchMyOrders } from '../features/orderSlice';
import Button from '../components/Button';
import socketService from '../api/socket';
import NotificationModal from '../components/NotificationModal';
import LiveTrackingMap from '../components/LiveTrackingMap';
import ReviewModal from '../components/ReviewModal';
import { useState } from 'react';
import { Star } from 'lucide-react';

const Orders = () => {
  const { orders, loading, error } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    orderId: '',
    productId: '',
    riderId: '',
    type: 'product',
    itemName: ''
  });
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  useEffect(() => {
    dispatch(fetchMyOrders());

    // Listen for order status updates
    socketService.on('order_status_update', (data) => {
      console.log("Order updated:", data);
      dispatch(fetchMyOrders());
      
      if (data.status === 'out-for-delivery') {
        const orderId = data.orderId || data.id || '';
        setNotification({
          isOpen: true,
          title: 'Order on the way!',
          message: `Your order #${orderId ? orderId.slice(-6).toUpperCase() : 'N/A'} is out for delivery. Get ready!`,
          type: 'order'
        });
      }
    });

    return () => {
      socketService.off('order_status_update');
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-red-500">
          <Package className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold dark:text-white">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <Button onClick={() => dispatch(fetchMyOrders())} className="mx-auto">
          Try Again
        </Button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold dark:text-white">No orders yet</h2>
        <p className="text-gray-600 dark:text-gray-400">You haven't placed any orders yet. Ready to try something delicious?</p>
        <Button onClick={() => navigate('/menu')} className="mx-auto">
          Explore Menu
        </Button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'preparing': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'on the way': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'delivered': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'cancelled': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <NotificationModal 
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      <ReviewModal 
        {...reviewModal}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
      />

      <div className="space-y-8 md:space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-black text-secondary-900 dark:text-white tracking-tighter">My <span className="text-primary-500">Orders</span></h1>
          <button 
            onClick={() => dispatch(fetchMyOrders())}
            className="p-3 bg-secondary-50 dark:bg-secondary-900 rounded-xl text-secondary-600 hover:bg-secondary-100 transition-all"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-6 md:space-y-8">
          {orders.map((order, index) => {
            const orderId = order._id || order.id || `order-${index}`;
            return (
              <div key={orderId} className="bg-slate-100 rounded-[2.5rem] md:rounded-[3rem] shadow-soft border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200">
                  <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="bg-primary-500/10 p-3 md:p-4 rounded-2xl">
                      <Package className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs font-black text-secondary-400 uppercase tracking-[0.2em]">Order #{orderId.toString().slice(-6).toUpperCase()}</p>
                      <h3 className="text-xl md:text-2xl font-black dark:text-white tracking-tight">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] md:text-xs font-black text-secondary-400 uppercase tracking-[0.2em]">Status</p>
                      <span className={`inline-block mt-1 px-3 md:px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] md:text-xs font-black text-secondary-400 uppercase tracking-[0.2em]">Total</p>
                      <p className="text-lg md:text-xl font-black text-primary-500 tracking-tighter">Rs. {Math.round(order.totalAmount || order.total || 0).toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => toggleOrderDetails(orderId)}
                      className={`p-3 bg-secondary-50 dark:bg-secondary-800 rounded-xl hover:bg-secondary-100 transition-all ${expandedOrderId === orderId ? 'rotate-90' : ''}`}
                    >
                      <ChevronRight className="h-6 w-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                {expandedOrderId === orderId && (
                  <div className="p-6 md:p-10 space-y-8 md:space-y-10 animate-in slide-in-from-top-4 duration-300">
                    {/* Order Items */}
                    <div className="bg-slate-50 p-6 rounded-2xl">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h4 className="text-sm font-black text-secondary-400 uppercase tracking-widest">Order Items</h4>
                        {order.status === 'delivered' && (
                          <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Rate items to help others</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-100 px-4 py-3 rounded-2xl text-sm border border-slate-200 shadow-sm group transition-all hover:shadow-md">
                              <div className="flex items-center space-x-3">
                                <span className="font-black text-primary-500">{item.quantity}x</span>
                                <span className="font-bold text-secondary-700 dark:text-gray-200">{item.product?.name || item.name || 'Product'}</span>
                              </div>
                              {order.status === 'delivered' && (
                                <button 
                                  onClick={() => setReviewModal({
                                    isOpen: true,
                                    orderId: orderId,
                                    productId: item.product?._id || item.product,
                                    riderId: '',
                                    type: 'product',
                                    itemName: item.product?.name || item.name
                                  })}
                                  className="flex items-center space-x-1 px-3 py-1 bg-primary-500/10 text-primary-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all"
                                >
                                  <Star className="h-3 w-3 fill-current" />
                                  <span>Rate</span>
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">No items details available</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Map Section - Only show if order is out for delivery */}
                    {order.status === 'out-for-delivery' && order.rider && (
                      <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-inner">
                        <LiveTrackingMap 
                          riderId={order.rider._id || order.rider} 
                          orderId={orderId}
                          destinationAddress={order.address}
                        />
                      </div>
                    )}

                    {/* Rider Review Section */}
                    {order.status === 'delivered' && order.rider && (
                      <div className="bg-primary-500/5 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-primary-500/10 flex flex-col sm:flex-row justify-between items-center gap-6 animate-in fade-in duration-500">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary-500 p-3 rounded-xl text-white">
                            <Star className="h-6 w-6 fill-current" />
                          </div>
                          <div>
                            <h4 className="text-sm md:text-base font-black text-secondary-900 dark:text-white tracking-tight uppercase">Rate your Rider</h4>
                            <p className="text-xs md:text-sm text-secondary-500 font-bold">How was your delivery experience?</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setReviewModal({
                            isOpen: true,
                            orderId: orderId,
                            productId: '',
                            riderId: order.rider._id || order.rider,
                            type: 'rider',
                            itemName: 'Delivery Rider'
                          })}
                          variant="primary" 
                          className="w-full sm:w-auto rounded-xl px-8 py-3 text-xs md:text-sm"
                        >
                          Rate Rider
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
