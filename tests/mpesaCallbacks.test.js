const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { rawJsonParser, verifyHmacSignature } = require('../middleware/webhookVerifier');

// Build a minimal app for testing middleware in isolation
function buildApp() {
  const app = express();
  app.post('/api/wallet/mpesa-callback', rawJsonParser(), verifyHmacSignature, (req, res) => {
    return res.json({ success: true });
  });
  return app;
}

describe('M-Pesa webhook callbacks', () => {
  let app;

  beforeAll(() => {
    process.env.MOCK_MODE = 'true';
    process.env.MPESA_WEBHOOK_SECRET = 'test_secret';
    app = buildApp();
  });

  test('STK callback accepted with valid signature', async () => {
    const payload = {
      Body: {
        stkCallback: {
          MerchantRequestID: 'MR_TEST',
          CheckoutRequestID: 'CH_TEST',
          ResultCode: 0,
          ResultDesc: 'Success',
          CallbackMetadata: {
            Item: [
              { Name: 'Amount', Value: 100 },
              { Name: 'MpesaReceiptNumber', Value: 'RCT123' },
              { Name: 'PhoneNumber', Value: '0710000000' }
            ]
          }
        }
      }
    };

    const raw = JSON.stringify(payload);
    const sig = require('crypto').createHmac('sha256', process.env.MPESA_WEBHOOK_SECRET).update(raw).digest('hex');

    const res = await request(app)
      .post('/api/wallet/mpesa-callback')
      .set('x-webhook-signature', sig)
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('STK callback rejected with missing signature', async () => {
    const payload = { Body: { stkCallback: { ResultCode: 0 } } };
    const res = await request(app).post('/api/wallet/mpesa-callback').send(payload);
    expect(res.statusCode).toBe(403);
  });
});
