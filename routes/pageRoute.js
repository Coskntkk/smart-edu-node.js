// Import modules
const express = require("express");
const pageController = require("../controllers/pageController");
const redirectMiddleware = require("../middlewares/redirectMiddleware");

// Create router
const router = express.Router();;

// Get the home page
router.route("/").get(pageController.getIndexPage);

// Get about page
router.route("/about").get(pageController.getAboutPage);

// /Contact
router.route("/contact")
    // Get the contact page
    .get(pageController.getContactPage)
    // Send the contact form
    .post(pageController.sendContactForm)
;

// Get register page
router.route("/register").get(redirectMiddleware, pageController.getRegisterPage);

// Get login page
router.route("/login").get(redirectMiddleware, pageController.getLoginPage);


// Export the router
module.exports = router;
