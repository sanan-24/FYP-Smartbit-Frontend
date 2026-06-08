import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { signupUser, clearError } from '../../features/authSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupUser(formData));
    if (signupUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const benefits = [
    "Priority Delivery Service",
    "500+ Luxury Restaurants",
    "Exclusive Concierge Support",
    "Curated Food Experiences"
  ];

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
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80" 
            alt="Artisan Pizza" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary-950 via-secondary-900/80 to-transparent"></div>
        
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
              className="space-y-8 max-w-xl"
            >
              <h2 className="text-7xl font-black text-white leading-[1.1] tracking-tighter">
                Begin your <br />
                <span className="text-primary-500 italic">gourmet</span> quest.
              </h2>
              
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + (idx * 0.1) }}
                    key={idx} 
                    className="flex items-center space-x-4 text-white"
                  >
                    <div className="bg-primary-500/20 p-1.5 rounded-full border border-primary-500/30">
                      <CheckCircle2 className="w-5 h-5 text-primary-400" />
                    </div>
                    <span className="text-lg font-bold text-secondary-100">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side: Refined Signup Form */}
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
            <h2 className="text-5xl font-black text-secondary-900 tracking-tight">Create Account</h2>
            <p className="text-secondary-500 text-lg font-medium">
              Join the elite community of food lovers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl">
                <p className="text-red-600 dark:text-red-400 text-sm font-bold">{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-5">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                icon={Mail}
                required
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Lock}
                required
              />
            </div>

            <label className="flex items-start group cursor-pointer mt-2">
              <input type="checkbox" className="mt-1.5 h-5 w-5 rounded-lg border-secondary-200 text-primary-500 focus:ring-primary-500 transition-all cursor-pointer" required />
              <span className="ml-3 text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed font-bold">
                I agree to the <button className="text-secondary-900 dark:text-white underline underline-offset-4">Terms of Service</button> and <button className="text-secondary-900 dark:text-white underline underline-offset-4">Privacy Policy</button>.
              </span>
            </label>

            <Button type="submit" className="w-full py-5 text-xl mt-4" loading={loading}>
              Create Account <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </form>

          <p className="text-center text-secondary-500 font-bold text-lg">
            Already registered?{' '}
            <Link to="/login" className="text-primary-600 font-black hover:text-primary-500 transition-colors underline underline-offset-8 decoration-2">
              Sign in here
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
