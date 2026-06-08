import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, 
  Filter, 
  Eye,
  Loader2,
  RefreshCcw,
  MapPin,
  X
} from 'lucide-react';
import { fetchAllOrders, updateOrderAdminStatus, fetchAvailableRiders, assignRiderToOrder } from '../redux/adminSlice';
import Button from '../../../components/Button';
import Pagination from '../../../components/Pagination';
import OrderDetailsModal from '../../../components/OrderDetailsModal';
import RiderDropdown from '../../../components/RiderDropdown';
import socketService from '../../../api/socket';
import LiveTrackingMap from '../../../components/LiveTrackingMap';

const MapModal = ({ isOpen, onClose, riderId, orderId, destinationAddress }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-secondary-900 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-secondary-950/30">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-500 p-2 rounded-xl text-white">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black dark:text-white leading-none">Live Tracking</h3>
              <p className="text-xs text-secondary-500 mt-1 font-bold uppercase tracking-widest">Order #{orderId?.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors">
            <X className="h-6 w-6 dark:text-white" />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
          <LiveTrackingMap 
            riderId={riderId}
            orderId={orderId}
            destinationAddress={destinationAddress}
          />
        </div>
      </div>
    </div>
  );
};

const OrderManagement = () => {
  const { orders, availableRiders: riders, loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeTracking, setActiveTracking] = useState(null);
  const itemsPerPage = 5;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAvailableRiders());

    // Listen for new orders in real-time
    socketService.on('new_order_placed', (data) => {
      console.log("Real-time: New order received!", data);
      dispatch(fetchAllOrders()); // Refresh list
      // Optional: Add notification sound or toast
    });

    return () => {
      socketService.off('new_order_placed');
    };
  }, [dispatch]);

  const handleTrackRider = (order) => {
    const rId = order.rider?._id || order.rider;
    if (rId) {
      setActiveTracking({
        riderId: rId,
        orderId: order._id,
        destinationAddress: order.address
      });
      setIsMapOpen(true);
    } else {
      alert("Rider not assigned yet.");
    }
  };

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateOrderAdminStatus({ id, status: newStatus }));
  };

  const handleRiderAssign = (orderId, riderId) => {
    if (riderId) {
      dispatch(assignRiderToOrder({ orderId, riderId }));
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'out-for-delivery':
      case 'on the way': return 'bg-purple-100 text-purple-700';
      case 'cooking':
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Fetching all orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black dark:text-white tracking-tight">Order Management</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Manage all incoming and past orders.</p>
        </div>
        <div className="flex space-x-2 md:space-x-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => dispatch(fetchAllOrders())} className="flex-1 sm:flex-none flex items-center justify-center text-[10px] md:text-sm py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl">
            <RefreshCcw className={`mr-2 h-3.5 w-3.5 md:h-4 md:w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button className="flex-1 sm:flex-none flex items-center justify-center text-[10px] md:text-sm py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl">
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm font-bold border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-secondary-100 dark:border-secondary-800 overflow-hidden transition-all duration-500">
        <div className="p-4 md:p-8 border-b border-secondary-100 dark:border-secondary-800 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-slate-50/50 dark:bg-secondary-950/30">
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Search by ID, Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-xl md:rounded-2xl py-2.5 md:py-3.5 px-10 md:px-12 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-xs md:text-sm dark:text-white transition-all outline-none"
            />
            <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-2 bg-white dark:bg-secondary-900 px-3 md:px-4 py-2 rounded-lg md:rounded-xl border border-secondary-100 dark:border-secondary-800 shadow-sm">
              <span className="text-[9px] md:text-xs font-black uppercase tracking-widest text-secondary-400">Total Orders:</span>
              <span className="text-xs md:text-sm font-black text-primary-500">{filteredOrders.length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar md:custom-scrollbar">
          <div className="min-w-[1000px] p-4 md:p-6">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 md:px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">
              <div className="col-span-2">Order ID</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Rider</div>
              <div className="col-span-2 text-center">Total</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="space-y-3">
              {paginatedOrders.length > 0 ? paginatedOrders.map((order, index) => (
                <div 
                  key={order._id} 
                  className={`grid grid-cols-12 gap-4 items-center px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 group hover:shadow-lg border border-transparent ${
                    index % 2 === 0 
                    ? 'bg-white dark:bg-secondary-900' 
                    : 'bg-gray-50/50 dark:bg-secondary-800/30'
                  } hover:border-primary-500/20`}
                >
                  <div className="col-span-2">
                    <span className="font-black text-primary-500 text-sm md:text-base">#{order._id.slice(-6).toUpperCase()}</span>
                  </div>
                  
                  <div className="col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 font-black text-xs md:text-sm uppercase">
                        {order.firstName?.charAt(0) || order.user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-secondary-900 dark:text-white text-xs md:text-sm truncate">{order.firstName} {order.lastName}</span>
                        <span className="text-[10px] text-secondary-500 font-medium truncate">{order.phoneNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`mx-auto px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-wider border-none focus:ring-0 cursor-pointer shadow-sm transition-all hover:scale-105 ${getStatusStyle(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cooking">Cooking</option>
                      <option value="out-for-delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="col-span-2 text-center">
                    {order.status === 'delivered' || order.status === 'cancelled' ? (
                      <span className="text-xs md:text-sm font-bold text-secondary-500 bg-secondary-100 dark:bg-secondary-800 px-3 py-1 rounded-lg">
                        {order.rider?.firstName || 'None'}
                      </span>
                    ) : (
                      <RiderDropdown 
                        riders={riders}
                        selectedRiderId={order.rider?._id}
                        onAssign={(riderId) => handleRiderAssign(order._id, riderId)}
                        loading={loading}
                      />
                    )}
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-black text-secondary-900 dark:text-white text-sm md:text-base">Rs. {order.totalAmount || order.total || 0}</span>
                      <span className="text-[9px] md:text-[10px] text-secondary-400 font-bold uppercase tracking-tighter">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="col-span-1 text-right flex justify-end space-x-1.5 md:space-x-2">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="p-2 md:p-2.5 bg-secondary-100 dark:bg-secondary-800 rounded-lg md:rounded-xl text-secondary-400 hover:text-primary-500 hover:bg-primary-500/10 transition-all shadow-sm active:scale-90"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                    {order.status === 'out-for-delivery' && order.rider && (
                      <button 
                        onClick={() => handleTrackRider(order)}
                        className="p-2 md:p-2.5 bg-secondary-100 dark:bg-secondary-800 rounded-lg md:rounded-xl text-secondary-400 hover:text-green-500 hover:bg-green-500/10 transition-all shadow-sm active:scale-90"
                        title="Live Track"
                      >
                        <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="py-16 md:py-24 text-center space-y-4 md:space-y-6 bg-slate-50/50 dark:bg-secondary-950/20 rounded-3xl border-2 border-dashed border-secondary-100 dark:border-secondary-800">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                    <Filter className="h-8 w-8 md:h-10 md:w-10 text-secondary-300" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <p className="text-secondary-900 dark:text-white font-black text-lg md:text-xl">No orders found</p>
                    <p className="text-xs text-secondary-500 font-bold mt-2 uppercase tracking-widest leading-relaxed">Try adjusting your search or filters</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination Wrapper */}
        <div className="p-4 md:p-8 border-t border-secondary-100 dark:border-secondary-800 bg-slate-50/30 dark:bg-secondary-950/20">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Map Tracking Modal */}
      <MapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        {...activeTracking}
      />
    </div>
  );
};

export default OrderManagement;
