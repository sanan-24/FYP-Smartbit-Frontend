import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Lock, Mail, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { resetPassword } from '../../features/authSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...resetData } = formData;
    const result = await dispatch(resetPassword(resetData));
    
    if (resetPassword.fulfilled.match(result)) {
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-white dark:bg-secondary-950">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 p-12 rounded-[2.5rem] bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-100 dark:border-secondary-800"
        >
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
              <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight">Success!</h2>
            <p className="text-secondary-500 dark:text-secondary-400 text-lg font-medium leading-relaxed">
              Your password has been reset successfully. Redirecting you to login...
            </p>
          </div>
          <Link to="/login" className="block">
            <Button className="w-full py-5 text-xl">
              Go to Login <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-stretch bg-white dark:bg-secondary-950">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-secondary-900">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1600&q=80" 
            alt="Security" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-950 via-secondary-900/80 to-transparent"></div>
        <div className="relative z-10 w-full p-20 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-4">
            <img src="/logo.jpg" alt="Smart Bite" className="h-16 w-auto rounded-full shadow-2xl" />
            <span className="text-5xl font-black text-white tracking-tighter drop-shadow-lg">Smart Bite</span>
          </Link>
          <div className="space-y-6 max-w-xl">
            <h2 className="text-7xl font-black text-white leading-[1.1] tracking-tighter">
              Reset your <br />
              <span className="text-primary-500 italic">access</span> safely.
            </h2>
            <p className="text-secondary-200 text-xl font-medium leading-relaxed">
              Verify your identity with the OTP sent to your email and choose a strong new password.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 sm:p-12 md:p-20 bg-white dark:bg-secondary-950">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-secondary-900 dark:text-white tracking-tight">Reset Password</h2>
            <p className="text-secondary-500 dark:text-secondary-400 text-lg font-medium">
              Enter the OTP and your new credentials below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl">
                <p className="text-red-600 dark:text-red-400 text-sm font-bold">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
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
                label="OTP Code"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                icon={KeyRound}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-5 text-xl" loading={loading}>
              Reset Password <ArrowRight className="ml-3 w-6 h-6" />
            </Button>

            <Link to="/login" className="flex items-center justify-center text-secondary-500 hover:text-primary-500 transition-colors font-bold">
              <ArrowLeft className="mr-2 w-5 h-5" /> Back to Login
            </Link>
          </form>

          <div className="pt-4 flex items-center justify-center space-x-3 text-secondary-300 dark:text-secondary-600 text-xs font-black uppercase tracking-[0.3em]">
            <ShieldCheck className="w-5 h-5" />
            <span>Secure Encryption</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
