const express = require("express");

const router = express.Router();

const {
    getUsers,
    getUsersByRole,
    updateUserProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Any authenticated user can view users.
router.get("/", protect, getUsers);

// Any authenticated user can filter users by role.
router.get("/role/:roleName", protect, getUsersByRole);

// Users can update their own profile.
router.put("/profile", protect, updateUserProfile);

module.exports = router;