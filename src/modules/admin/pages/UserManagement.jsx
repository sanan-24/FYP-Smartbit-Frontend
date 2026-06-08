import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  Trash2,
  UserCircle,
  Loader2,
  RefreshCcw,
  Edit2
} from 'lucide-react';
import { fetchAllUsers, deleteUser } from '../redux/adminSlice';
import Button from '../../../components/Button';
import Pagination from '../../../components/Pagination';

const UserManagement = () => {
  const { users, loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      dispatch(deleteUser(id));
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Fetching all users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black dark:text-white tracking-tight">User Management</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Manage system users and their access levels.</p>
        </div>
        <div className="flex space-x-2 md:space-x-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => dispatch(fetchAllUsers())} className="flex-1 sm:flex-none flex items-center justify-center text-[10px] md:text-sm py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl">
            <RefreshCcw className={`mr-2 h-3.5 w-3.5 md:h-4 md:w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button className="flex-1 sm:flex-none flex items-center justify-center text-[10px] md:text-sm py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl">
            Export Users
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-secondary-100 dark:border-secondary-800 overflow-hidden transition-all duration-500">
        <div className="p-4 md:p-8 border-b border-secondary-100 dark:border-secondary-800 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-slate-50/50 dark:bg-secondary-950/30">
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-xl md:rounded-2xl py-2.5 md:py-3.5 px-10 md:px-12 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-xs md:text-sm dark:text-white transition-all outline-none"
            />
            <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <div className="flex items-center">
            <div className="text-[9px] md:text-sm font-black text-secondary-400 bg-white dark:bg-secondary-900 px-3 md:px-4 py-2 rounded-lg md:rounded-xl border border-secondary-100 dark:border-secondary-800 shadow-sm uppercase tracking-widest">
              Total Users: <span className="text-primary-500 ml-1">{filteredUsers.length}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar md:custom-scrollbar">
          <div className="min-w-[900px] p-4 md:p-6">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 md:px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-400">
              <div className="col-span-4">User Details</div>
              <div className="col-span-3">Email Address</div>
              <div className="col-span-2 text-center">Role</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="space-y-3 mt-2">
              {paginatedUsers.length > 0 ? paginatedUsers.map((user, index) => (
                <div 
                  key={user._id} 
                  className={`grid grid-cols-12 gap-4 items-center px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 group hover:shadow-lg border border-transparent ${
                    index % 2 === 0 
                    ? 'bg-white dark:bg-secondary-900' 
                    : 'bg-gray-50/50 dark:bg-secondary-800/30'
                  } hover:border-primary-500/20`}
                >
                  <div className="col-span-4">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 font-black text-xs md:text-sm uppercase shadow-sm">
                        {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-secondary-900 dark:text-white text-xs md:text-base leading-tight truncate">{user.firstName} {user.lastName}</span>
                        <span className="text-[10px] md:text-xs text-secondary-500 font-medium uppercase tracking-widest mt-0.5">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <span className="text-xs md:text-sm font-semibold text-secondary-600 dark:text-secondary-400 truncate block">{user.email}</span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className={`mx-auto px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-wider flex items-center justify-center w-fit shadow-sm ${
                      user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : user.role === 'rider'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  <div className="col-span-3 text-right flex justify-end space-x-1.5 md:space-x-2">
                    <button className="p-2 md:p-2.5 bg-secondary-100 dark:bg-secondary-800 rounded-lg md:rounded-xl text-secondary-400 hover:text-primary-500 hover:bg-primary-500/10 transition-all shadow-sm active:scale-90">
                      <Edit2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2 md:p-2.5 bg-secondary-100 dark:bg-secondary-800 rounded-lg md:rounded-xl text-secondary-400 hover:text-red-500 hover:bg-red-500/10 transition-all shadow-sm active:scale-90"
                    >
                      <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-16 md:py-24 text-center space-y-4 md:space-y-6 bg-slate-50/50 dark:bg-secondary-950/20 rounded-3xl border-2 border-dashed border-secondary-100 dark:border-secondary-800">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-secondary-900 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                    <UserCircle className="h-8 w-8 md:h-10 md:w-10 text-secondary-300" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <p className="text-secondary-900 dark:text-white font-black text-lg md:text-xl">No users found</p>
                    <p className="text-xs text-secondary-500 font-bold mt-2 uppercase tracking-widest leading-relaxed">Try adjusting your search query</p>
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
    </div>
  );
};

export default UserManagement;
