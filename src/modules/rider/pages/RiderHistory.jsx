import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  History, 
  Package, 
  CheckCircle, 
  XCircle,
  Loader2,
  RefreshCcw,
  Clock
} from 'lucide-react';
import { fetchAssignedOrders } from '../redux/riderSlice';

const RiderHistory = () => {
  const { assignedOrders, loading } = useSelector((state) => state.rider);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAssignedOrders());
  }, [dispatch]);

  const historyOrders = assignedOrders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  if (loading && historyOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
        <p className="text-secondary-400 font-black uppercase tracking-widest text-xs">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-12 pb-20 px-3 md:px-0">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500/10 rounded-xl md:rounded-2xl flex items-center justify-center">
            <History className="h-5 w-5 md:h-6 md:w-6 text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-black dark:text-white tracking-tight flex items-center">
              Delivery History
              <span className="ml-3 px-3 py-1 bg-secondary-800 text-white text-[8px] md:text-[10px] font-black rounded-full uppercase">
                {historyOrders.length}
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

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-secondary-900 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black text-secondary-400 uppercase tracking-widest">Address</th>
                <th className="px-8 py-6 text-[10px] font-black text-secondary-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-secondary-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {historyOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors duration-300">
                  <td className="px-8 py-6">
                    <span className="font-black text-primary-500">#{order._id.slice(-6).toUpperCase()}</span>
                    <p className="text-[10px] text-secondary-400 font-bold mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {new Date(order.updatedAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-secondary-800 flex items-center justify-center font-black text-secondary-500 text-xs">
                        {order.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold dark:text-white text-sm">{order.firstName} {order.lastName}</p>
                        <p className="text-[10px] text-secondary-400 font-bold">{order.phoneNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-[200px] truncate font-bold text-secondary-500 text-xs">
                    {order.address}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center justify-center w-fit mx-auto ${
                      order.status === 'delivered' 
                      ? 'bg-green-50 text-green-600 border border-green-100' 
                      : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {order.status === 'delivered' ? <CheckCircle className="h-3 w-3 mr-2" /> : <XCircle className="h-3 w-3 mr-2" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-black dark:text-white">
                    Rs. {order.totalAmount || order.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {historyOrders.map((order) => (
          <div key={order._id} className="bg-white dark:bg-secondary-900 rounded-2xl p-5 border border-slate-100 dark:border-white/5 shadow-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black dark:text-white tracking-tight">#{order._id.slice(-6).toUpperCase()}</h3>
                  <p className="text-[9px] text-secondary-400 font-bold flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {new Date(order.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                order.status === 'delivered' 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
              }`}>
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-y border-slate-50 dark:border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-secondary-800 flex items-center justify-center font-black text-secondary-500 text-[10px]">
                  {order.firstName?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold dark:text-white text-xs">{order.firstName} {order.lastName}</p>
                  <p className="text-[9px] text-secondary-400 font-bold truncate max-w-[150px]">{order.address}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black dark:text-white">Rs. {order.totalAmount || order.total}</p>
                <p className="text-[8px] text-secondary-400 font-bold uppercase">Amount</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {historyOrders.length === 0 && !loading && (
        <div className="py-20 text-center space-y-4 bg-white dark:bg-secondary-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-white/5 shadow-inner">
          <div className="w-16 h-16 bg-slate-50 dark:bg-secondary-800 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Package className="h-8 w-8 text-secondary-300" />
          </div>
          <div className="max-w-xs mx-auto px-4">
            <p className="text-lg font-black dark:text-white">No history found</p>
            <p className="text-[10px] text-secondary-400 font-bold uppercase tracking-widest mt-1">Complete some orders first</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderHistory;
