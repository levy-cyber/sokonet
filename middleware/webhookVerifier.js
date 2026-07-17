const express = require("express");

/*
 * Parses JSON sent by M-Pesa callback requests.
 */
const rawJsonParser = () => {
    return express.json();
};

/*
 * Verifies webhook signatures.
 * For development purposes, we're allowing all requests.
 */
const verifyHmacSignature = (req, res, next) => {
    next();
};

module.exports = {
    rawJsonParser,
    verifyHmacSignature,
};