const express = require("express");
const router = express.Router();

const {
    mpesaDeposit,
    mpesaWithdraw,
    handleStkCallback,
} = require("../controllers/walletController");

const { protect } = require("../middleware/authMiddleware");

router.post("/deposit", mpesaDeposit);
router.post("/withdraw", mpesaWithdraw);
router.post("/callback", handleStkCallback);

module.exports = router;