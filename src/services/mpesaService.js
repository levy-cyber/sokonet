const axios = require("axios");
const moment = require("moment");
require("dotenv").config();
const generateAccessToken = async () => {
    // Code goes here
};

const generateTimestamp = () => {
    // Code goes here
};

const generatePassword = () => {
    // Code goes here
};

const initiateSTKPush = async () => {
    // Code goes here
};

const querySTKStatus = async () => {
    // Code goes here
};

const sendB2CPayment = async () => {
    // Code goes here
};
const moment = require("moment");

const generateTimestamp = () => {
    return moment().format("YYYYMMDDHHmmss");
};
const generatePassword = () => {

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = generateTimestamp();

    const password = Buffer.from(
        shortcode + passkey + timestamp
    ).toString("base64");

    return {
        password,
        timestamp,
    };
};
const axios = require("axios");
const generateAccessToken = async () => {

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    const auth = Buffer.from(
        consumerKey + ":" + consumerSecret
    ).toString("base64");


    const response = await axios.get(

        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",

        {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        }

    );

    return response.data.access_token;

};

module.exports = {
    generateAccessToken,
    generateTimestamp,
    generatePassword,
    initiateSTKPush,
    querySTKStatus,
    sendB2CPayment,
};