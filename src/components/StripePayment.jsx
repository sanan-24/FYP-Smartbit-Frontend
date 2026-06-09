import React, { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Button from './Button';
import { AlertCircle, CreditCard, Calendar, Lock } from 'lucide-react';
import paymentApi from '../api/payment';

// Shared Stripe element styles
const stripeElementStyle = {
  base: {
    fontSize: '15px',
    color: '#1a1a2e',
    fontFamily: '"Inter", sans-serif',
    fontWeight: '600',
    '::placeholder': {
      color: '#94a3b8',
      fontWeight: '400',
    },
    backgroundColor: 'transparent',
  },
  invalid: {
    color: '#ef4444',
    iconColor: '#ef4444',
  },
};

const StripePayment = ({ amount, onSuccess, onLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    onLoading(true);
    setError(null);

    try {
      // 1. Create Payment Intent on backend
      const response = await paymentApi.createPaymentIntent({ amount });

      if (!response.data || !response.data.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      const clientSecret = response.data.clientSecret;

      // 2. Confirm payment using CardNumberElement
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setProcessing(false);
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Card Number */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-black text-secondary-500 uppercase tracking-widest">
          <CreditCard className="h-3.5 w-3.5" /> Card Number
        </label>
        <div className="w-full bg-white dark:bg-secondary-900 border-2 border-slate-100 dark:border-secondary-700 rounded-2xl px-4 py-3.5 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
          <CardNumberElement options={{ style: stripeElementStyle, showIcon: true }} />
        </div>
      </div>

      {/* Expiry + CVC side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-secondary-500 uppercase tracking-widest">
            <Calendar className="h-3.5 w-3.5" /> Expiry
          </label>
          <div className="w-full bg-white dark:bg-secondary-900 border-2 border-slate-100 dark:border-secondary-700 rounded-2xl px-4 py-3.5 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
            <CardExpiryElement options={{ style: stripeElementStyle }} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-black text-secondary-500 uppercase tracking-widest">
            <Lock className="h-3.5 w-3.5" /> CVC
          </label>
          <div className="w-full bg-white dark:bg-secondary-900 border-2 border-slate-100 dark:border-secondary-700 rounded-2xl px-4 py-3.5 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all">
            <CardCvcElement options={{ style: stripeElementStyle }} />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-center text-sm font-bold">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing}
        loading={processing}
        className="w-full py-4"
      >
        Pay Rs. {amount} & Place Order
      </Button>
    </form>
  );
};

export default StripePayment;
