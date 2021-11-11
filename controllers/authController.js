// Import models
const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
// Import modules
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator');

// Create new user
exports.createUser = async (req, res) => {
  try {
    // Create new user
    const user = await User.create(req.body);
    // Redirect to login page
    res.status(201).redirect("/login");

  } catch (error) {
    // If error, redirect to same page
    const errors = validationResult(req);
    for (let i=0; i<errors.array().length; i++) {
      req.flash("error", errors.array()[i].msg);
    }
    res.status(400).redirect("back");
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    // Find user by email
    const { email, password } = req.body;
    const user = await User.findOne({email: email});
    // Check if user exists
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (!err || same) {
          // If password is correct, set session
          req.session.userID = user._id;
          res.status(200).redirect("/users/dashboard");
        } else {
          // If password is incorrect, redirect to same page
          req.flash("error", "Invalid password");
          res.status(400).redirect("back");
        }
      });
    } else {
      // If user doesn't exist, redirect to same page
      req.flash("error", "User doesn't exist");
      res.status(400).redirect("back");
    }
  } catch (error) {
    // If error, redirect to same page
    req.flash("error", "Invalid email");
    res.status(400).redirect("back");
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  // Destroy session
  req.session.destroy(() => {
    res.redirect("/");
  });
};

// Get dashboard page
exports.getDashboardPage = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findOne( { _id: req.session.userID} ).populate("courses");
    // Find all users
    const users = await User.find();
    // Find all categories
    const categories = await Category.find();
    // Find user's courses
    const courses = await Course.find( {  user: req.session.userID } );
    // Render dashboard page
    res.status(200).render("dashboard", {
      pageName: "dashboard",
      user,
      categories,
      users,
      courses
    });

  } catch (error) {
    // If error, redirect to home page
    res.status(400).redirect("/");
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    // Find user and its courses, delete user
    await User.findByIdAndRemove(req.params.id)
    const courses = await Course.find( { user: req.params.id } );
    // Delete courses from enrolled users
    for (let i=0; i<courses.length; i++) {
      await User.updateMany({courses: {$in: [courses[i]._id]}}, {$pull: {courses: courses[i]._id}});
    }
    // Delete courses
    await Course.deleteMany({user:req.params.id})
    // Redirect to dashboard page
    req.flash("success", "User deleted");
    res.status(200).redirect("/users/dashboard");

  } catch (error) {
    // If error, redirect to dashboard page
    req.flash("error", "User doesn't exist" + error);
    res.status(400).redirect("/users/dashboard");
  }
}