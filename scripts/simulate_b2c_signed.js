const axios = require('axios');
const crypto = require('crypto');

async function run() {
  const base = process.env.SERVER_URL || 'http://localhost:5000';
  const secret = process.env.MPESA_WEBHOOK_SECRET || 'test_secret';

  const payload = {
    ConversationID: `CONV_${Math.random().toString(36).slice(2,9)}`,
    Result: {
      ResultType: 0,
      ResultCode: 0,
      ResultDesc: 'The service request is processed successfully.'
    }
  };

  const raw = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', secret).update(raw).digest('hex');

  try {
    const res = await axios.post(`${base}/api/wallet/mpesa-b2c-result`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': signature
      }
    });
    console.log('Callback response:', res.data);
  } catch (err) {
    console.error('Error sending signed callback:', err.response ? err.response.data : err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
}

run();
