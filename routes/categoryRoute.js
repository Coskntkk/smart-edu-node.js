// Import modules
const express = require("express");
const categoryController = require("../controllers/categoryController");

// Create router
const router = express.Router();

// .../categories
router.route("/")
    // Create a new category
    .post(categoryController.createCategory)
;

// .../categories/:id
router.route("/:id")
    // Delete a category
    .delete(categoryController.deleteCategory)
;


// Export the router
module.exports = router;
