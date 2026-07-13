const axios = require('axios');

async function run() {
  const base = process.env.SERVER_URL || 'http://localhost:5000';
  const token = process.env.TEST_AUTH_TOKEN || '';

  try {
    console.log('Triggering simulated STK callback...');
    const res = await axios.post(
      `${base}/api/wallet/simulate-stk`,
      { amount: 50, phoneNumber: '0710000000', reference: `SIM_${Date.now()}` },
      { headers: { Authorization: token ? `Bearer ${token}` : '' } }
    );
    console.log('Simulate response:', res.data);

    console.log('Fetching wallet transactions (requires a user token)...');
    if (token) {
      const tx = await axios.get(`${base}/api/wallet/transactions`, { headers: { Authorization: `Bearer ${token}` } });
      console.log('Transactions:', tx.data);
    } else {
      console.log('No TEST_AUTH_TOKEN set; skipping protected transactions fetch.');
    }
  } catch (err) {
    console.error('Simulation error:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

run();
