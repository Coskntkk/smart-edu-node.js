// Import modules
const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const { body, validationResult } = require('express-validator');

// Create router
const router = express.Router();

// localhost:3000/users

// /users/signup
router.route("/signup")
    .post(
        [
            // Validate the name field
            body("name").not().isEmpty().withMessage(" Name is required"),
            // Validate the email field and chek if it's a valid email
            body("email").isEmail().withMessage(" Email is required")
            .custom((userEmail) => {
                return User.findOne({ email: userEmail }).then(user => {
                    if (user) {
                        return Promise.reject("Email already exists");
                    }
                });
            }),
            // Validate the password field
            body("password").isLength({ min: 6 }).withMessage(" Password must be at least 6 characters long")
        ],
        authController.createUser
    )
;

// /users/:id
router.route("/:id")
    // Delete user
    .delete(authMiddleware, authController.deleteUser)

// /users/login
router.route("/login")
    // Login user
    .post(authController.loginUser)
;

// /users/logout
router.route("/logout")
    // Logout user
    .get(authController.logoutUser)
;

// /users/dashboard
router.route("/dashboard")
    // Get user dashboard
    .get(authMiddleware, authController.getDashboardPage)
;


// Export the router
module.exports = router;
