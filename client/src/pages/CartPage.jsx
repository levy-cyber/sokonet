import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiCreditCard } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const cartTotal = getCartTotal();
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="w-12 h-12 text-gray-600" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8">Start shopping to add items to your cart</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-black font-semibold rounded-lg hover:bg-brand/90 transition-all"
          >
            <FiShoppingBag className="w-5 h-5" />
            Browse Marketplace
          </Link>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Shopping Cart</h1>
            <p className="text-gray-400">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your cart?')) {
                clearCart();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
          >
            <FiTrash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 lg:p-6"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-all"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-all"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-lg">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs">
                          KES {item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-white">KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Escrow Protection</span>
                  <span className="text-green-400">Included</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-400">KES {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-black font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
              >
                <FiCreditCard className="w-5 h-5" />
                Proceed to Checkout
                <FiArrowRight className="w-5 h-5" />
              </Link>

              <div className="mt-6 p-4 bg-gray-800/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <FiCreditCard className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Secure Payment</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Your payment is protected by SokoNet escrow until you receive your order.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPage;