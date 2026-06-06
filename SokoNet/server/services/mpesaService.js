export const initiateMpesaDeposit = async ({ amount, phone, reference }) => {
  return {
    status: 'pending',
    provider: 'MPESA-SIMULATED',
    amount,
    phone,
    reference,
    message: `MPesa STK push initiated for ${phone}`,
  };
};

export const verifyMpesaPayment = async ({ reference }) => {
  return {
    success: true,
    reference,
    confirmedAt: new Date(),
  };
};
