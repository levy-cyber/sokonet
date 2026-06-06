export const createStripeCharge = async ({ amount, currency, source, description }) => {
  return {
    success: true,
    transactionId: `stripe_${Date.now()}`,
    amount,
    currency,
    description,
  };
};
