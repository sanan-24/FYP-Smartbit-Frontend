import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from './Button';
import { AlertCircle } from 'lucide-react';
import paymentApi from '../api/payment';

const StripePayment = ({ amount, onSuccess, onLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    onLoading(true);
    setError(null);

    try {
      // 1. Create Payment Intent on backend using paymentApi (uses cookies)
      const response = await paymentApi.createPaymentIntent({ amount });

      if (!response.data || !response.data.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      const clientSecret = response.data.clientSecret;

      // 2. Confirm payment on frontend
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onSuccess(result.paymentIntent.id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setProcessing(false);
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-slate-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                backgroundColor: 'transparent',
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing}
        loading={processing}
        className="w-full"
      >
        Pay Rs. {amount} & Place Order
      </Button>
    </form>
  );
};

export default StripePayment;
