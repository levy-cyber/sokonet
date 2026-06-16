const express = require('express');
const router = express.Router();
const {
  getAllUsers, getPlatformStats,
  updateUser, suspendUser, activateUser, blockUser, deleteUser,
  getAllProducts, adminRemoveProduct,
  getAllJobs, getAllServices,
  getActivityLog, getSettings, updateSetting,
  getCompanyTill, depositToTill,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/activate', activateUser);
router.put('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);

// Platform stats
router.get('/stats', getPlatformStats);

// Content management
router.get('/products', getAllProducts);
router.delete('/products/:id', adminRemoveProduct);
router.get('/jobs', getAllJobs);
router.get('/services', getAllServices);

// Activity log
router.get('/activity', getActivityLog);

// Platform settings
router.get('/settings', getSettings);
router.put('/settings/:key', updateSetting);

// Company till
router.get('/till', getCompanyTill);
router.post('/till/deposit', depositToTill);

module.exports = router;
