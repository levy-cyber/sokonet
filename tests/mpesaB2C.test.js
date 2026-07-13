const request = require('supertest');
const express = require('express');
const { rawJsonParser, verifyHmacSignature } = require('../middleware/webhookVerifier');

function buildApp() {
  const app = express();
  app.post('/api/wallet/mpesa-b2c-result', rawJsonParser(), verifyHmacSignature, (req, res) => {
    return res.json({ success: true });
  });
  app.post('/api/wallet/mpesa-b2c-timeout', rawJsonParser(), verifyHmacSignature, (req, res) => {
    return res.json({ success: true });
  });
  return app;
}

describe('M-Pesa B2C webhook callbacks', () => {
  let app;
  beforeAll(() => {
    process.env.MPESA_WEBHOOK_SECRET = 'test_secret';
    app = buildApp();
  });

  test('B2C result accepted with valid signature', async () => {
    const payload = { ConversationID: 'CONV_TEST', Result: { ResultCode: 0 } };
    const raw = JSON.stringify(payload);
    const sig = require('crypto').createHmac('sha256', process.env.MPESA_WEBHOOK_SECRET).update(raw).digest('hex');

    const res = await request(app)
      .post('/api/wallet/mpesa-b2c-result')
      .set('x-webhook-signature', sig)
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('B2C timeout rejected without signature', async () => {
    const payload = { ConversationID: 'CONV_TEST' };
    const res = await request(app).post('/api/wallet/mpesa-b2c-timeout').send(payload);
    expect(res.statusCode).toBe(403);
  });
});
