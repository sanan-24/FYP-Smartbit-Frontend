import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Mail, 
  Lock, 
  Loader2,
  Bike,
  Filter,
  Edit2,
  Star,
  RefreshCcw,
  Plus,
  Power
} from 'lucide-react';
import { createRider, fetchAllRiders, deleteRider, fetchAvailableRiders } from '../redux/adminSlice';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Pagination from '../../../components/Pagination';

const RiderManagement = () => {
  const { riders, loading, error } = useSelector((state) => state.admin);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'rider'
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllRiders());
  }, [dispatch]);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createRider(formData));
    if (!result.error) {
      setShowAddModal(false);
      setFormData({ email: '', password: '', role: 'rider' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this rider?')) {
      dispatch(deleteRider(id));
    }
  };

  const handleToggleStatus = (id) => {
    // Status toggle logic
  };

  const filteredRiders = riders.filter(rider => 
    (rider.firstName + ' ' + (rider.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(rider => ({
    ...rider,
    name: rider.firstName + ' ' + (rider.lastName || ''),
    phoneNumber: rider.phoneNumber || 'N/A',
    isActive: rider.isActive !== undefined ? rider.isActive : true
  }));

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black dark:text-white tracking-tight">Rider Management</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Manage delivery partners and their status.</p>
        </div>
        <div className="flex space-x-2 md:space-x-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => dispatch(fetchAllRiders())} className="flex-1 sm:flex-none flex items-center justify-center text-[10px] md:text-sm py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl">
            <RefreshCcw className={`mr-2 h-3.5 w-3.5 md:h-4 md:w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center text-[10px] md:text-sm py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl shadow-premium"
          >
            <Plus className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" /> Add Rider
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-secondary-100 dark:border-secondary-800 overflow-hidden transition-all duration-500">
        <div className="p-4 md:p-8 border-b border-secondary-100 dark:border-secondary-800 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-slate-50/50 dark:bg-secondary-950/30">
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Search riders by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-xl md:rounded-2xl py-2.5 md:py-3.5 px-10 md:px-12 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-xs md:text-sm dark:text-white transition-all outline-none"
            />
            <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <div className="flex items-center">
            <div className="text-[9px] md:text-sm font-black text-secondary-400 bg-white dark:bg-secondary-900 px-3 md:px-4 py-2 rounded-lg md:rounded-xl border border-secondary-100 dark:border-secondary-800 shadow-sm uppercase tracking-widest">
              Total Riders: <span className="text-primary-500 ml-1">{filteredRiders.length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar md:custom-scrollbar">
          <div className="min-w-[900px] p-4 md:p-6">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 md:px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">
              <div className="col-span-4">Rider Details</div>
              <div className="col-span-2 text-center">Contact</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Availability</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="space-y-3 mt-2">
              {filteredRiders.length > 0 ? filteredRiders.map((rider, index) => (
                <div 
                  key={rider._id} 
                  className={`grid grid-cols-12 gap-4 items-center px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 group hover:shadow-lg border border-transparent ${
                    index % 2 === 0 
                    ? 'bg-white dark:bg-secondary-900' 
                    : 'bg-gray-50/50 dark:bg-secondary-800/30'
                  } hover:border-primary-500/20`}
                >
                  <div className="col-span-4">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-secondary-900 dark:bg-secondary-800 flex items-center justify-center text-white font-black text-xs md:text-sm uppercase shadow-lg">
                        {rider.name?.charAt(0) || 'R'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-secondary-900 dark:text-white text-xs md:text-base leading-tight truncate">{rider.name}</span>
                        <span className="text-[10px] md:text-xs text-secondary-500 font-medium truncate">{rider.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="text-xs md:text-sm font-bold text-secondary-700 dark:text-secondary-300 whitespace-nowrap">{rider.phoneNumber}</span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className={`mx-auto px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-wider flex items-center justify-center w-fit shadow-sm ${
                      rider.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                    }`}>
                      {rider.isActive ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${rider.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-secondary-300'}`}></span>
                      <span className="text-[10px] md:text-xs font-black text-secondary-500 uppercase tracking-widest">
                        {rider.isAvailable ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 text-right flex justify-end space-x-1.5 md:space-x-2">
                    <button 
                      onClick={() => handleToggleStatus(rider._id)}
                      className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all shadow-sm active:scale-90 ${
                        rider.isActive 
                        ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'
                      }`}
                      title={rider.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(rider._id)}
                      className="p-2 md:p-2.5 bg-secondary-100 dark:bg-secondary-800 rounded-lg md:rounded-xl text-secondary-400 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-sm active:scale-90"
                      title="Delete Rider"
                    >
                      <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-16 md:py-24 text-center space-y-4 md:space-y-6 bg-slate-50/50 dark:bg-secondary-950/20 rounded-3xl border-2 border-dashed border-secondary-100 dark:border-secondary-800">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                    <Bike className="h-8 w-8 md:h-10 md:w-10 text-secondary-300" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <p className="text-secondary-900 dark:text-white font-black text-lg md:text-xl">No riders found</p>
                    <p className="text-xs text-secondary-500 font-bold mt-2 uppercase tracking-widest leading-relaxed">Add delivery partners to start managing them</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Rider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black dark:text-white">Add New Rider</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <Lock className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="rider@example.com"
                    required
                  />
                  <Mail className="absolute right-4 top-11 h-5 w-5 text-gray-400" />
                </div>
                <div className="relative">
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="ΓùÅΓùÅΓùÅΓùÅΓùÅΓùÅΓùÅΓùÅ"
                    required
                  />
                  <Lock className="absolute right-4 top-11 h-5 w-5 text-gray-400" />
                </div>
                
                <div className="pt-4 flex space-x-3">
                  <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading} className="flex-1">
                    Create Account
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderManagement;
