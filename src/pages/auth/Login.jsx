import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginUser, clearError } from '../../features/authSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only redirect if we are sure about authentication AND user data is present
    if (isAuthenticated && currentUser) {
      const role = currentUser.role?.toLowerCase();
      
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'rider') {
        navigate('/rider/dashboard', { replace: true });
      } else if (role === 'user') {
        navigate('/', { replace: true });
      }
      // If role is undefined or something else, we don't redirect yet to avoid Home page loop
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload;
      const role = user?.role?.toLowerCase();
      
      console.log('Login successful, detected role:', role);

      if (role === 'admin') {
        console.log('Redirecting to Admin Dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'rider') {
        console.log('Redirecting to Rider Dashboard');
        navigate('/rider/dashboard', { replace: true });
      } else {
        console.log('Redirecting to Home (Default)');
        navigate('/', { replace: true });
      }
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-stretch bg-white">
      {/* Left Side: Dynamic Branding Section */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-secondary-900">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80" 
            alt="Premium Food" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-950 via-secondary-900/80 to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[96px] bg-primary-600/5 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 w-full p-16 xl:p-20 flex flex-col justify-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full mb-12"
          >
            <Link to="/" className="flex items-center gap-4">
              <img src="/logo.jpg" alt="Smart Bite" className="h-16 w-auto rounded-full shadow-2xl" />
              <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">Smart Bite</span>
            </Link>
          </motion.div>

          <div className="space-y-10 w-full max-w-2xl">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="space-y-6 max-w-xl"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 text-primary-400 text-sm font-black uppercase tracking-widest">
                <Star className="w-4 h-4 mr-2 fill-current" />
                The Gold Standard of Delivery
              </div>
              <h2 className="text-7xl font-black text-white leading-[1.1] tracking-tighter">
                Exquisite taste, <br />
                <span className="text-primary-500 italic">instantly</span> yours.
              </h2>
              <p className="text-secondary-200 text-xl font-medium leading-relaxed">
                Join over 50,000+ food connoisseurs who trust Smart Bite for their daily culinary adventures.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center space-x-8 md:space-x-12"
            >
              <div className="space-y-1">
                <p className="text-3xl font-black text-white">30m</p>
                <p className="text-secondary-400 text-xs font-black uppercase tracking-widest">Avg. Delivery</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-white">4.9/5</p>
                <p className="text-secondary-400 text-xs font-black uppercase tracking-widest">User Rating</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-white">500+</p>
                <p className="text-secondary-400 text-xs font-black uppercase tracking-widest">Restaurants</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side: Refined Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 sm:p-10 md:p-14 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8 mx-auto"
        >
          <div className="space-y-4">
            <div className="lg:hidden mb-10 flex justify-center">
              <Link to="/" className="text-4xl font-black text-secondary-900 tracking-tighter">
                Smart Bite
              </Link>
            </div>
            <h2 className="text-5xl font-black text-secondary-900 tracking-tight">Sign In</h2>
            <p className="text-secondary-500 text-lg font-medium">
              Welcome back! Please enter your credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl">
                <p className="text-red-600 dark:text-red-400 text-sm font-bold">{error}</p>
              </div>
            )}
            <div className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                icon={Mail}
                required
              />
              
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[46px] text-secondary-400 hover:text-primary-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer h-5 w-5 rounded-lg border-secondary-200 text-primary-500 focus:ring-primary-500 transition-all cursor-pointer" />
                </div>
                <span className="ml-3 text-sm text-secondary-600 dark:text-secondary-400 font-bold group-hover:text-secondary-900 dark:group-hover:text-white transition-colors">Keep me signed in</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-sm text-primary-600 dark:text-primary-400 font-black hover:text-primary-500 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full py-5 text-xl" loading={loading}>
              Sign In <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </form>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-secondary-100 dark:border-secondary-800"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-6 bg-white dark:bg-secondary-950 text-secondary-400 font-black uppercase tracking-[0.2em]">Social Login</span></div>
          </div>

          <div className="flex justify-center">
            <button className="w-full max-w-xs flex items-center justify-center py-4 px-6 border-2 border-secondary-100 rounded-2xl hover:bg-secondary-50 transition-all font-black text-secondary-700">
              Google
            </button>
          </div> */}

          <p className="text-center text-secondary-500 dark:text-secondary-400 font-bold text-lg">
            New here?{' '}
            <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-black hover:text-primary-500 transition-colors underline underline-offset-8 decoration-2">
              Create an account
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Login;
