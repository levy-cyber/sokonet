const axios = require("axios");

class MpesaService {

    constructor() {

        this.consumerKey =
            process.env.MPESA_CONSUMER_KEY;

        this.consumerSecret =
            process.env.MPESA_CONSUMER_SECRET;

        this.shortCode =
            process.env.MPESA_SHORTCODE;

        this.passkey =
            process.env.MPESA_PASSKEY;

        this.environment =
            process.env.MPESA_ENV || "sandbox";

        this.backendURL =
            process.env.BACKEND_URL;


        this.baseURL =
            this.environment === "sandbox"

                ? "https://sandbox.safaricom.co.ke"

                : "https://api.safaricom.co.ke";

    }


    //---------------------------------
    // ACCESS TOKEN
    //---------------------------------

    async getAccessToken() {

        const auth = Buffer.from(

            `${this.consumerKey}:${this.consumerSecret}`

        ).toString("base64");


        try {

            const response = await axios.get(

                `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,

                {
                    headers: {
                        Authorization: `Basic ${auth}`
                    }
                }

            );

            return response.data.access_token;

        }

        catch (error) {

            console.error(

                "Access Token Error:",

                error.response?.data || error.message

            );

            throw new Error(

                "Failed to generate M-Pesa access token."

            );

        }

    }



    //---------------------------------
    // TIMESTAMP
    //---------------------------------

    generateTimestamp() {

        const date = new Date();

        const pad = (n) => String(n).padStart(2, "0");

        return (

            date.getFullYear() +

            pad(date.getMonth() + 1) +

            pad(date.getDate()) +

            pad(date.getHours()) +

            pad(date.getMinutes()) +

            pad(date.getSeconds())

        );

    }



    //---------------------------------
    // PASSWORD
    //---------------------------------

    generatePassword(timestamp) {

        return Buffer.from(

            `${this.shortCode}${this.passkey}${timestamp}`

        ).toString("base64");

    }



    //---------------------------------
    // STK PUSH
    //---------------------------------

    async triggerStkPush(

        phoneNumber,
        amount,
        reference,
        description

    ) {

        const token =
            await this.getAccessToken();


        const timestamp =
            this.generateTimestamp();


        const password =
            this.generatePassword(timestamp);



        const url =

            `${this.baseURL}/mpesa/stkpush/v1/processrequest`;


        const payload = {

            BusinessShortCode:
                this.shortCode,

            Password:
                password,

            Timestamp:
                timestamp,

            TransactionType:
                "CustomerPayBillOnline",

            Amount:
                Number(amount),

            PartyA:
                phoneNumber,

            PartyB:
                this.shortCode,

            PhoneNumber:
                phoneNumber,

            CallBackURL:
                `${this.backendURL}/api/wallet/mpesa-callback`,

            AccountReference:
                reference,

            TransactionDesc:
                description

        };


        try {

            const response = await axios.post(

                url,

                payload,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            return response.data;

        }

        catch (error) {

            console.error(

                "STK PUSH ERROR:",

                error.response?.data || error.message

            );

            throw new Error(

                "Failed to initiate STK Push."

            );

        }

    }



    //---------------------------------
    // B2C PAYOUT
    //---------------------------------

    async triggerPayout(

        phoneNumber,
        amount,
        remarks

    ) {

        const token =
            await this.getAccessToken();


        const url =
            `${this.baseURL}/mpesa/b2c/v1/paymentrequest`;


        const payload = {

            InitiatorName:
                process.env.MPESA_INITIATOR_NAME,

            SecurityCredential:
                process.env.MPESA_SECURITY_CREDENTIAL,

            CommandID:
                "BusinessPayment",

            Amount:
                Number(amount),

            PartyA:
                this.shortCode,

            PartyB:
                phoneNumber,

            Remarks:
                remarks,

            QueueTimeOutURL:
                `${this.backendURL}/api/wallet/mpesa-b2c-timeout`,

            ResultURL:
                `${this.backendURL}/api/wallet/mpesa-b2c-result`,

            Occasion:
                "Wallet Withdrawal"

        };


        try {

            const response = await axios.post(

                url,

                payload,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );

            return response.data;

        }

        catch (error) {

            console.error(

                "B2C ERROR:",

                error.response?.data || error.message

            );

            throw new Error(

                "Failed to send B2C payment."

            );

        }

    }

}


module.exports =
    new MpesaService();