import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { forgotPassword, clearError } from '../../features/authSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword(email));
    if (forgotPassword.fulfilled.match(result)) {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-white dark:bg-secondary-950">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8 p-12 rounded-[2.5rem] bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-100 dark:border-secondary-800"
        >
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full animate-pulse"></div>
              <CheckCircle2 className="w-20 h-20 text-primary-500 relative z-10" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight">Check Email</h2>
            <p className="text-secondary-500 dark:text-secondary-400 text-lg font-medium leading-relaxed">
              We've sent a password reset OTP to <span className="text-secondary-900 dark:text-white font-bold">{email}</span>.
            </p>
          </div>
          <div className="space-y-4">
            <Button onClick={() => navigate('/reset-password', { state: { email } })} className="w-full py-5 text-xl">
              Enter OTP & Reset <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Link to="/login" className="block text-secondary-500 font-bold hover:text-primary-500 transition-colors">
              Back to Login
            </Link>
          </div>
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
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80" 
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
              Secure your <br />
              <span className="text-primary-500 italic">account</span> effortlessly.
            </h2>
            <p className="text-secondary-200 text-xl font-medium leading-relaxed">
              Don't worry, we'll help you get back into your account in no time.
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
            <h2 className="text-5xl font-black text-secondary-900 dark:text-white tracking-tight">Forgot Password?</h2>
            <p className="text-secondary-500 dark:text-secondary-400 text-lg font-medium">
              Enter your email address and we'll send you a recovery link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl">
                <p className="text-red-600 dark:text-red-400 text-sm font-bold">{error}</p>
              </div>
            )}
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              icon={Mail}
              required
            />
            <Button type="submit" className="w-full py-5 text-xl" loading={loading}>
              Send Recovery Link <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Link to="/login" className="flex items-center justify-center text-secondary-500 hover:text-primary-500 transition-colors font-bold">
              <ArrowLeft className="mr-2 w-5 h-5" /> Back to Login
            </Link>
          </form>

          <div className="pt-8 flex items-center justify-center space-x-3 text-secondary-300 dark:text-secondary-600 text-xs font-black uppercase tracking-[0.3em]">
            <ShieldCheck className="w-5 h-5" />
            <span>Secure Recovery</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
