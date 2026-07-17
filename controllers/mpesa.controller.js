const express = require("express");

const router = express.Router();

const mpesa = require(
"../controllers/mpesa.controller"
);


router.post(

"/stk-push",

mpesa.stkPush

);


module.exports = router;