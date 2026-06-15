const axios = require('axios');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.env = process.env.MPESA_ENV || 'sandbox';
  }

  // Generates OAuth token for Safaricom Daraja API
  async getOAuthToken() {
    if (this.consumerKey === 'dummy_mpesa_consumer_key') {
      return 'mock_oauth_token_12345';
    }

    const url = this.env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa OAuth Error:', error.response ? error.response.data : error.message);
      throw new Error('Failed to retrieve M-Pesa access token');
    }
  }

  // Triggers STK Push (Lipa na M-Pesa Online)
  async triggerStkPush(phoneNumber, amount, referenceCode, description) {
    console.log(`[M-Pesa] Triggering STK Push of KES ${amount} to ${phoneNumber}`);
    
    if (this.consumerKey === 'dummy_mpesa_consumer_key') {
      // Simulate successful STK push request receipt
      return {
        MerchantRequestID: `MR_${Math.random().toString(36).substr(2, 9)}`,
        CheckoutRequestID: `CH_${Math.random().toString(36).substr(2, 9)}`,
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CustomerMessage: 'Success. Request accepted for processing',
        isMock: true,
      };
    }

    const token = await this.getOAuthToken();
    const url = this.env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/query'
      : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/query';

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    
    // Normalize phone number to format 254XXXXXXXXX
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const requestBody = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: this.shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: `https://Netsoko-backend-url.railway.app/api/wallet/mpesa-callback`,
      AccountReference: referenceCode,
      TransactionDesc: description,
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('M-Pesa STK Push Error:', error.response ? error.response.data : error.message);
      throw new Error('M-Pesa STK Push transaction failed');
    }
  }

  // Trigger B2C payment (withdraw to phone)
  async triggerPayout(phoneNumber, amount, description) {
    console.log(`[M-Pesa B2C] Sending KES ${amount} to ${phoneNumber}`);
    
    if (this.consumerKey === 'dummy_mpesa_consumer_key') {
      // Simulate successful B2C payout
      return {
        ConversationID: `CON_${Math.random().toString(36).substr(2, 9)}`,
        OriginatorConversationID: `OCON_${Math.random().toString(36).substr(2, 9)}`,
        ResponseCode: '0',
        ResponseDescription: 'Accept the service request successfully.',
        isMock: true,
      };
    }

    const token = await this.getOAuthToken();
    const url = this.env === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest'
      : 'https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest';

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    
    // Normalize phone number to format 254XXXXXXXXX
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const requestBody = {
      InitiatorName: 'testapi',
      SecurityCredential: password,
      CommandID: 'BusinessPayment',
      Amount: Math.round(amount),
      PartyA: this.shortcode,
      PartyB: formattedPhone,
      Remarks: description,
      QueueTimeOutURL: 'https://Netsoko-backend-url.railway.app/api/wallet/mpesa-b2c-timeout',
      ResultURL: 'https://Netsoko-backend-url.railway.app/api/wallet/mpesa-b2c-result',
      Occasion: 'WalletWithdrawal',
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('M-Pesa B2C Error:', error.response ? error.response.data : error.message);
      throw new Error('M-Pesa B2C transaction failed');
    }
  }
}

module.exports = new MpesaService();
