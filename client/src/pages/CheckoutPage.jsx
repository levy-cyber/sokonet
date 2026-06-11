import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiCreditCard, FiSmartphone, FiMapPin, FiLock, FiCheck, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartTotal = getCartTotal();

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || !shippingAddress) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setOrderPlaced(true);
      clearCart();
      setIsProcessing(false);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-400 mb-6">
            Your order has been placed and is being processed. You will receive a confirmation shortly.
          </p>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-3 text-left">
              <div className="flex justify-between text-gray-400">
                <span>Order Total</span>
                <span className="text-white">KES {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Payment Method</span>
                <span className="text-white">
                  {selectedPayment === 'mpesa' ? 'M-Pesa' : 'Credit Card'}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping Address</span>
                <span className="text-white text-sm max-w-xs truncate">{shippingAddress}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-black font-semibold rounded-lg hover:bg-brand/90 transition-all"
          >
            <FiShoppingBag className="w-5 h-5" />
            View Orders
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Checkout</h1>
        <p className="text-gray-400 mb-8">Complete your order securely with SokoNet escrow protection</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiMapPin className="text-brand" />
                Shipping Information
              </h2>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
                    placeholder="Enter your full delivery address"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
                    placeholder="+254 XXX XXX XXX"
                    required
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('mpesa')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedPayment === 'mpesa'
                          ? 'border-brand bg-brand/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FiSmartphone className="text-2xl text-green-400" />
                        <div className="text-left">
                          <p className="text-white font-medium">M-Pesa</p>
                          <p className="text-gray-400 text-xs">Instant payment</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPayment('card')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedPayment === 'card'
                          ? 'border-brand bg-brand/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FiCreditCard className="text-2xl text-blue-400" />
                        <div className="text-left">
                          <p className="text-white font-medium">Credit Card</p>
                          <p className="text-gray-400 text-xs">Visa, Mastercard</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl">
                  <FiLock className="text-green-400 mt-1" />
                  <div>
                    <p className="text-white text-sm font-medium">Secure Escrow Protection</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Your payment is held securely until you receive and confirm your order.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-black font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <FiSmartphone className="w-5 h-5" />
                      Pay KES {cartTotal.toLocaleString()}
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      <p className="text-green-400 text-sm font-semibold">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span className="text-green-400">KES {cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPage;