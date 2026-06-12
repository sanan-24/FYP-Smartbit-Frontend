import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, ArrowRight, MailCheck } from 'lucide-react';
import { verifyEmail } from '../../features/authSlice';
import Button from '../../components/Button';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('info');
      setMessage('We have sent a verification link to your email address. Please check your inbox (and spam folder) to verify your account.');
      return;
    }

    const performVerification = async () => {
      if (verificationStarted.current) return;
      verificationStarted.current = true;

      try {
        const result = await dispatch(verifyEmail(token)).unwrap();
        setStatus('success');
        setMessage(result.message || 'Email verified successfully!');
      } catch (err) {
        console.error('Verification Error:', err);
        setStatus('error');
        const errorMessage = typeof err === 'string' ? err : (err?.message || 'Verification failed. The link may be expired or invalid.');
        setMessage(errorMessage);
      }
    };

    performVerification();
  }, [token, dispatch]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-white dark:bg-secondary-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8 p-12 rounded-[2.5rem] bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-100 dark:border-secondary-800 shadow-2xl shadow-secondary-200/50 dark:shadow-none"
      >
        <div className="flex justify-center">
          {status === 'loading' && (
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full animate-pulse"></div>
              <Loader2 className="w-20 h-20 text-primary-500 animate-spin relative z-10" />
            </div>
          )}
          {status === 'success' && (
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
              <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
            </div>
          )}
          {status === 'error' && (
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
              <XCircle className="w-20 h-20 text-red-500 relative z-10" />
            </div>
          )}
          {status === 'info' && (
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full animate-pulse"></div>
              <MailCheck className="w-20 h-20 text-primary-500 relative z-10" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight">
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Verified!'}
            {status === 'error' && 'Oops!'}
            {status === 'info' && 'Check Email'}
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 text-lg font-medium leading-relaxed">
            {message || 'Please wait while we process your request.'}
          </p>
        </div>

        <div className="pt-6">
          {status === 'success' && (
            <Button onClick={() => navigate('/login')} className="w-full py-5 text-xl">
              Proceed to Login <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          )}
          {(status === 'error' || status === 'info') && (
            <div className="space-y-4">
              <Button onClick={() => navigate('/login')} className="w-full py-5 text-xl">
                Go to Login <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Link to="/signup" className="block text-primary-500 font-bold hover:underline">
                Back to Signup
              </Link>
            </div>
          )}
          {status === 'loading' && (
            <div className="h-16 flex items-center justify-center text-secondary-400 font-black uppercase tracking-[0.2em] text-sm">
              Securing your account...
            </div>
          )}
        </div>

        <div className="pt-4 flex items-center justify-center space-x-3 text-secondary-300 dark:text-secondary-600 text-xs font-black uppercase tracking-[0.3em]">
          <MailCheck className="w-5 h-5" />
          <span>Email Security Check</span>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
