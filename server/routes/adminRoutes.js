const express = require('express');
const { getAllUsers, getCompanyTill, depositToTill } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/till', getCompanyTill);
router.post('/till/deposit', depositToTill);

module.exports = router;
