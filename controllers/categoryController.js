// Import model
const Category = require("../models/Category");

// Create a category
exports.createCategory = async (req, res) => {
  try {
    // Create a new category
    const category = await Category.create(req.body);
    // Redirect to the same page
    req.flash("success", `${category.name} was created successfully`);
    res.status(201).redirect("back");

  } catch (error) {
    // Redirect to the same page with error
    req.flash("error", error.message);
    res.status(400).redirect("back");
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    // Find the category and delete it
    const category = await Category.findByIdAndDelete(req.params.id);
    req.flash("success", `${category.name} was deleted successfully`);
    res.status(200).redirect("back");

  } catch (error) {
    // Redirect to the same page with error
    req.flash("error", error.message);
    res.status(400).redirect("back");
  }
};
