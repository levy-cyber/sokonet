class StripeService {
  constructor() {
    this.secretKey = process.env.STRIPE_SECRET_KEY;
  }

  // Create a payment intent (returns Client Secret for frontend confirmation)
  async createPaymentIntent(amount, currency = 'kes', metadata = {}) {
    console.log(`[Stripe] Creating Payment Intent for ${amount} ${currency.toUpperCase()}`);
    
    // Simulate payment intent creation
    const clientSecret = `pi_mock_${Math.random().toString(36).substr(2, 12)}_secret_${Math.random().toString(36).substr(2, 10)}`;
    return {
      id: `pi_mock_${Math.random().toString(36).substr(2, 12)}`,
      clientSecret: clientSecret,
      amount,
      currency,
      status: 'requires_payment_method',
      isMock: true,
    };
  }

  // Refunding a payment
  async refundPayment(chargeId, amount) {
    console.log(`[Stripe] Refunding Charge ${chargeId} for amount ${amount}`);
    return {
      id: `re_mock_${Math.random().toString(36).substr(2, 12)}`,
      amount,
      status: 'succeeded',
      isMock: true,
    };
  }
}

module.exports = new StripeService();
