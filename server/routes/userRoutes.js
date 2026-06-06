const express = require('express');
const { getUsers, getUsersByRole, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.get('/role/:roleName', protect, getUsersByRole);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
