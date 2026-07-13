const request = require('supertest');
const express = require('express');
const crypto = require('crypto');

// Mount real routes
const walletRoutes = require('../routes/walletRoutes');
const { mockDB } = require('../config/db');

describe('M-Pesa integration (mock mode) end-to-end', () => {
  let app;

  beforeAll(() => {
    process.env.MOCK_MODE = 'true';
    process.env.MPESA_WEBHOOK_SECRET = 'test_secret';

    app = express();
    // Don't override route-level raw parser
    app.use('/api/wallet', walletRoutes);
    // Ensure mock wallet exists
    if (!mockDB.wallets || mockDB.wallets.length === 0) {
      mockDB.wallets = [
        {
          _id: 'wallet1',
          user: 'user1',
          balance: 10000,
          currency: 'KES',
          transactions: [],
          createdAt: new Date(),
        },
      ];
    }
  });

  test('STK callback credits mock wallet', async () => {
    const initial = mockDB.wallets[0].balance;
    const payload = {
      Body: {
        stkCallback: {
          MerchantRequestID: 'MR_INTEGRATION',
          CheckoutRequestID: 'CH_INTEGRATION',
          ResultCode: 0,
          ResultDesc: 'Success',
          CallbackMetadata: { Item: [{ Name: 'Amount', Value: 250 }, { Name: 'MpesaReceiptNumber', Value: 'RCTINT' }, { Name: 'PhoneNumber', Value: '0710000000' }] }
        }
      }
    };
    const raw = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', process.env.MPESA_WEBHOOK_SECRET).update(raw).digest('hex');

    const res = await request(app).post('/api/wallet/mpesa-callback').set('x-webhook-signature', sig).send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockDB.wallets[0].balance).toBe(initial + 250);
  });

  test('B2C result accepted', async () => {
    const payload = { ConversationID: 'CONV_INTEGRATION', Result: { ResultCode: 0 } };
    const raw = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', process.env.MPESA_WEBHOOK_SECRET).update(raw).digest('hex');

    const res = await request(app).post('/api/wallet/mpesa-b2c-result').set('x-webhook-signature', sig).send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
