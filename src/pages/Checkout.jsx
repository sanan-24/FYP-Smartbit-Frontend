import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { clearCart } from '../features/cartSlice';
import { createOrder, resetOrderState } from '../features/orderSlice';
import Button from '../components/Button';
import Input from '../components/Input';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePayment from '../components/StripePayment';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { success, loading: orderLoading, error: orderError } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      dispatch(clearCart());
      setStep(3);
      dispatch(resetOrderState());
    }
  }, [success, dispatch]);

  const deliveryFee = 150;
  const finalTotal = totalAmount + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (paymentIntentId = null) => {
    if (!formData.address || !formData.phoneNumber || !formData.firstName) {
      alert('Please fill in all required fields');
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        product: item._id || item.id,
        quantity: item.quantity,
      })),
      paymentMethod: paymentMethod,
      paymentStatus: paymentIntentId ? 'paid' : 'pending',
      // ✅ FIX: transactionId sirf tab bhejo jab actual value ho
      // null bhejne se Joi validator fail karta tha ("must be a string")
      ...(paymentIntentId ? { transactionId: paymentIntentId } : {}),
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      deliveryFee: deliveryFee,
    };
    dispatch(createOrder(orderData));
  };


  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold dark:text-white">Order Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Thank you for your order. We've received it and our chefs are already working on it!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={() => navigate('/orders')}>View Order History</Button>
          <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Checkout Forms */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 md:space-x-4 mb-6 md:mb-8">
            <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-bold text-sm md:text-base ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`flex-grow h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-bold text-sm md:text-base ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          </div>

          {step === 1 ? (
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
              <h2 className="text-xl md:text-2xl font-bold dark:text-white flex items-center">
                <Truck className="mr-3 text-primary" /> Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" required />
                <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" required />
                <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="03001234567" className="md:col-span-2" required />
                <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="House 12, Street 5" className="md:col-span-2" required />
                <Input label="City" name="city" value={formData.city} onChange={handleInputChange} placeholder="Food City" required />
                <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="12345" required />
              </div>
              <Button onClick={() => setStep(2)} className="w-full py-4 md:py-5">Continue to Payment</Button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
              <h2 className="text-xl md:text-2xl font-bold dark:text-white flex items-center">
                <CreditCard className="mr-3 text-primary" /> Payment Method
              </h2>

              {orderError && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center text-sm">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {orderError}
                </div>
              )}

              <div className="space-y-4">
                {/* Cash Option */}
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border-2 transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
                >
                  <div className="flex items-center">
                    <div className="bg-white dark:bg-gray-700 p-2 rounded-lg mr-4 shadow-sm">
                      <Truck className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when your food arrives</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-4 ${paymentMethod === 'cash' ? 'border-primary bg-white' : 'border-gray-200 bg-transparent'}`}></div>
                </div>

                {/* Stripe Option */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}
                >
                  <div className="flex items-center">
                    <div className="bg-white dark:bg-gray-700 p-2 rounded-lg mr-4 shadow-sm">
                      <CreditCard className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">Online Payment (Stripe)</p>
                      <p className="text-xs text-gray-500">Secure payment via credit/debit card</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-4 ${paymentMethod === 'card' ? 'border-primary bg-white' : 'border-gray-200 bg-transparent'}`}></div>
                </div>

                {paymentMethod === 'cash' ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 animate-in fade-in duration-300">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You've selected <strong>Cash on Delivery</strong>. Please ensure you have the exact amount ready for the rider.
                    </p>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2 duration-300">
                    <Elements stripe={stripePromise}>
                      <StripePayment
                        amount={finalTotal}
                        onSuccess={(id) => handlePlaceOrder(id)}
                        onLoading={() => { }}
                      />
                    </Elements>
                  </div>
                )}
              </div>

              {paymentMethod === 'cash' && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                  <Button onClick={() => handlePlaceOrder()} loading={orderLoading} className="flex-1">
                    Place Order Rs. {finalTotal}
                  </Button>
                </div>
              )}
              <p className="text-center text-xs text-gray-500 flex items-center justify-center">
                <ShieldCheck className="mr-1 h-3 w-3" /> Your order is secure and protected.
              </p>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold dark:text-white">Your Order</h2>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-bold text-gray-900 dark:text-white">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="font-semibold dark:text-white">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="flex justify-between text-lg font-bold dark:text-white pt-2">
                <span>Total</span>
                <span className="text-primary dark:text-secondary">Rs. {finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
