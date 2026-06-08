import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';
import { 
  Users, 
  ShoppingBag, 
  Bike,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Loader2,
  Download,
  FileText,
  Table
} from 'lucide-react';
import { fetchAdminStats, fetchAllOrders } from '../redux/adminSlice';
import socketService from '../../../api/socket';

const mockData = {
  weekly: [
    { name: 'Mon', orders: 45 },
    { name: 'Tue', orders: 52 },
    { name: 'Wed', orders: 48 },
    { name: 'Thu', orders: 61 },
    { name: 'Fri', orders: 55 },
    { name: 'Sat', orders: 67 },
    { name: 'Sun', orders: 70 },
  ],
  monthly: [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
  ],
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-white dark:bg-app-surface-dark p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-soft border border-slate-100 dark:border-slate-800 theme-transition hover:shadow-premium group">
    <div className="flex justify-between items-start">
      <div className="bg-primary-50 dark:bg-primary-900/20 p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
        <Icon className="h-5 w-5 md:h-7 md:w-7 text-primary-500" />
      </div>
      <div className={`flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${trend === 'up' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
        {trend === 'up' ? <ArrowUpRight className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> : <ArrowDownRight className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />}
        {trendValue}
      </div>
    </div>
    <div className="mt-4 md:mt-8">
      <p className="text-[9px] md:text-xs text-secondary-400 font-black uppercase tracking-[0.15em] md:tracking-[0.2em]">{title}</p>
      <h3 className="text-xl md:text-3xl font-black mt-1 md:mt-2 dark:text-white tracking-tight">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { stats, charts, loading, orders } = useSelector((state) => state.admin);
  const [timeframe, setTimeframe] = React.useState('weekly');
  const [isExporting, setIsExporting] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminStats(timeframe));
    // Also fetch all orders for the table view
    dispatch(fetchAllOrders());

    // Real-time stats update on new order
    socketService.on('new_order_placed', () => {
      dispatch(fetchAdminStats(timeframe));
      dispatch(fetchAllOrders());
    });

    return () => {
      socketService.off('new_order_placed');
    };
  }, [dispatch, timeframe]);

  const handleExport = async (format) => {
     setIsExporting(true);
     try {
       const response = await fetch(`http://localhost:5000/api/v1/admin/export?timeframe=${timeframe}`, {
         credentials: 'include',
       });
       
       if (response.ok) {
         const blob = await response.blob();
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `stats-${timeframe}-${format}.${format}`;
         document.body.appendChild(a);
         a.click();
         window.URL.revokeObjectURL(url);
       }
     } catch (error) {
       console.error('Export failed:', error);
     } finally {
       setIsExporting(false);
     }
   };

  // Use real data from API or fallback to mock for demonstration if empty
  const weeklyData = charts?.orderVolume?.length > 0 ? charts.orderVolume : mockData.weekly;
  const monthlyData = charts?.revenueStream?.length > 0 ? charts.revenueStream : mockData.monthly;

  if (loading && (!stats || stats.totalOrders === 1250)) { // Better check for initial loading
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
        <p className="text-secondary-500 font-bold">Loading real-time analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-12">
      <div className="print:hidden space-y-6 md:space-y-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter">Insights</h1>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm md:text-lg font-medium">Real-time performance analytics of Smart Bite.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full lg:w-auto">
            {/* Timeframe Selector */}
            <div className="flex items-center space-x-1 bg-white dark:bg-secondary-900 p-1 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft overflow-x-auto no-scrollbar">
              {['daily', 'weekly', 'monthly', 'yearly'].map((tf) => (
                <button 
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                    timeframe === tf 
                      ? 'bg-primary-500 text-white shadow-glow' 
                      : 'text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Export Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 md:px-5 py-2.5 md:py-3 bg-secondary-900 dark:bg-white dark:text-secondary-900 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-soft"
              >
                <Table className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                CSV
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 md:px-5 py-2.5 md:py-3 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-700 font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-soft"
              >
                <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          <StatCard 
            title="Gross Orders" 
            value={stats.totalOrders} 
            icon={ShoppingBag} 
            trend="up" 
            trendValue="12.5%" 
          />
          <StatCard 
            title="Revenue" 
            value={`Rs. ${stats.totalRevenue.toLocaleString()}`} 
            icon={DollarSign} 
            trend="up" 
            trendValue="8.2%" 
          />
          <StatCard 
            title="User Growth" 
            value={stats.totalUsers} 
            icon={Users} 
            trend="up" 
            trendValue="5.1%" 
          />
          <StatCard 
            title="Active Riders" 
            value={stats.totalRiders} 
            icon={Bike} 
            trend="down" 
            trendValue="2.4%" 
          />
        </div>
      </div>

      {/* Print-only Table for PDF Export */}
      <div className="hidden print:block mt-10 p-5 bg-white text-black">
        <div className="text-center mb-10 border-b-2 border-secondary-900 pb-5">
          <h2 className="text-3xl font-black uppercase tracking-widest">Smart Bite - Sales Report</h2>
          <p className="text-sm font-bold mt-2">Timeframe: {timeframe.toUpperCase()} | Generated on: {new Date().toLocaleString()}</p>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-900 text-white">
              <th className="p-4 border border-secondary-800 text-xs font-black uppercase">Order ID</th>
              <th className="p-4 border border-secondary-800 text-xs font-black uppercase">Customer</th>
              <th className="p-4 border border-secondary-800 text-xs font-black uppercase">Date</th>
              <th className="p-4 border border-secondary-800 text-xs font-black uppercase">Status</th>
              <th className="p-4 border border-secondary-800 text-xs font-black uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.slice(0, 20).map((order) => (
                <tr key={order._id || order.id} className="border-b border-slate-200">
                  <td className="p-4 border border-slate-200 text-xs font-medium">#{(order._id || order.id || '').slice(-6).toUpperCase()}</td>
                  <td className="p-4 border border-slate-200 text-xs font-medium">{order.customer?.email || 'Guest'}</td>
                  <td className="p-4 border border-slate-200 text-xs font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 border border-slate-200 text-xs font-bold uppercase tracking-tighter">{order.status}</td>
                  <td className="p-4 border border-slate-200 text-xs font-black text-right">Rs. {order.totalAmount || order.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-slate-400 font-bold">No data available for this report</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50">
              <td colSpan="4" className="p-4 border border-slate-200 text-right font-black uppercase text-xs">Total Revenue</td>
              <td className="p-4 border border-slate-200 text-right font-black text-primary-500">Rs. {stats.totalRevenue.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        
        <div className="mt-20 text-[10px] text-slate-400 font-bold text-center italic">
          This is a computer-generated report and does not require a signature.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 print:hidden">
        {/* Weekly Orders Chart */}
        <div className="bg-white dark:bg-app-surface-dark p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <h3 className="text-xl md:text-2xl font-black dark:text-white tracking-tight">Order Volume</h3>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 dark:bg-secondary-900 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary-500" />
            </div>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 9}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 9}} />
                <Tooltip 
                  cursor={{fill: 'rgba(249, 115, 22, 0.05)'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)', padding: '12px'}}
                />
                <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Analytics Chart */}
        <div className="bg-white dark:bg-app-surface-dark p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-soft border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6 md:mb-10">
            <h3 className="text-xl md:text-2xl font-black dark:text-white tracking-tight">Revenue Stream</h3>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 dark:bg-secondary-900 flex items-center justify-center">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-primary-500" />
            </div>
          </div>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 9}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 9}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)', padding: '12px'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#f97316" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
