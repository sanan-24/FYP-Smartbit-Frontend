import React from 'react';
import { X, Package, MapPin, Phone, User, Clock, CreditCard, ShoppingBag } from 'lucide-react';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'on the way': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'preparing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-secondary-900 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-secondary-950/30">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-500 p-3 rounded-2xl text-white shadow-lg shadow-primary-500/20">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black dark:text-white leading-tight">Order Details</h2>
              <p className="text-secondary-500 font-bold text-sm">#{order._id?.toUpperCase() || 'N/A'}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl transition-colors"
          >
            <X className="h-6 w-6 dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Status & Date */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
              {order.status}
            </div>
            <div className="flex items-center text-secondary-500 font-bold text-sm">
              <Clock className="h-4 w-4 mr-2" />
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>

          {/* Customer & Address Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-5 w-5 text-primary-500" />
                <h3 className="font-black text-secondary-900 dark:text-white uppercase tracking-widest text-xs">Customer Information</h3>
              </div>
              <p className="font-bold dark:text-white text-lg">{order.firstName} {order.lastName}</p>
              <p className="text-secondary-500 font-medium flex items-center mt-2">
                <Phone className="h-3 w-3 mr-2" /> {order.phoneNumber}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-5 w-5 text-orange-500" />
                <h3 className="font-black text-secondary-900 dark:text-white uppercase tracking-widest text-xs">Delivery Address</h3>
              </div>
              <p className="font-bold dark:text-white leading-relaxed">{order.address}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-5 w-5 text-primary-500" />
              <h3 className="font-black text-secondary-900 dark:text-white uppercase tracking-widest text-xs">Order Items</h3>
            </div>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-secondary-800 rounded-2xl border border-slate-100 dark:border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center font-black text-primary-500">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{item.product?.name || 'Product'}</p>
                      <p className="text-xs text-secondary-500 font-medium">Rs. {item.price} per item</p>
                    </div>
                  </div>
                  <p className="font-black dark:text-white">Rs. {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-primary-500/5 dark:bg-primary-500/10 p-6 rounded-3xl border border-primary-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-primary-500" />
                <h3 className="font-black text-secondary-900 dark:text-white uppercase tracking-widest text-xs">Payment Summary</h3>
              </div>
              <span className="px-3 py-1 bg-primary-500 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
                {order.paymentMethod === 'cash' ? 'COD' : 'Paid'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-secondary-500 font-medium">
                <span>Subtotal</span>
                <span>Rs. {order.totalAmount || order.total}</span>
              </div>
              <div className="flex justify-between text-secondary-500 font-medium">
                <span>Delivery Fee</span>
                <span>Rs. 0</span>
              </div>
              <div className="pt-2 mt-2 border-t border-primary-500/10 flex justify-between items-center">
                <span className="font-black text-secondary-900 dark:text-white">Total Amount</span>
                <span className="text-2xl font-black text-primary-500">Rs. {order.totalAmount || order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-secondary-950/30">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-secondary-900 dark:bg-white text-white dark:text-secondary-900 rounded-2xl font-black text-lg hover:scale-[1.02] transition-transform shadow-xl"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
