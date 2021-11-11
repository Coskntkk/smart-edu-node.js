// Import models
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Create a new course
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });
    // Redirect to the courses page
    req.flash("success", `${course.name} created successfully`);
    res.status(201).redirect("/courses");

  } catch (error) {
    // Redirect to the courses page if there is an error
    req.flash("error", `Request failed.`);
    res.status(400).redirect("/courses");
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    // Set filters
    const categorySlug = req.query.categories;
    const category = await Category.findOne({slug: categorySlug});
    const query = req.query.search;
    let filter = {name: "", category: null};
    if(categorySlug){
      filter = {}
    };
    if(query){
      filter = {name: query}
    }
    if(!query && !categorySlug){
      filter.name = "",
      filter.category = null
    }
    // Find courses according to the filter
    const courses = await Course.find({
      $or: [
        {name: {$regex: ".*" + filter.name + ".*", $options: 'i'}},
        {category: filter.category},
      ]
    }).sort("-createdAt").populate("user");
    // Find categories
    const categories = await Category.find();
    // Render the courses page
    res.status(200).render("courses", { pageName:"courses", courses, categories });

  } catch (error) {
    // Render the home page if there is an error
    req.flash("error", `Request failed.`);
    res.status(400).redirect("/");
  }
};

// Get a course by slug
exports.getCourse = async (req, res) => {
  try {
    // Find the course by slug
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne( {slug: req.params.slug} ).populate("user");
    const categories = await Category.find();
    // Render the course page
    res.status(200).render("course", { pageName:"course", course, categories, user });

  } catch (error) {
    // Render the home page if there is an error
    req.flash("error", `Request failed.`);
    res.status(400).redirect("/");
  }
};

// Update a course by slug
exports.updateCourse = async (req, res) => {
  try {
    // Find the course by slug and update it
    const course = await Course.findOneAndUpdate( {slug: req.params.slug}, req.body, {
      new: true,
      runValidators: true
    });
    // Redirect to the course page
    req.flash("success", `${course.name} updated successfully`);
    res.status(200).redirect("/dashboard");

  } catch (error) {
    // Render the home page if there is an error
    req.flash("error", `Request failed.`);
    res.status(400).redirect("/");
  }
};

// Delete a course by slug
exports.deleteCourse = async (req, res) => {
  try {
    // Find the course by slug
    const course = await Course.findOne({slug: req.params.slug});
    // Delete the course from enroled users
    await User.updateMany({role: "student", courses: {$in: [course._id]}}, {$pull: {courses: course._id }});
    // Find the course by slug and delete it
    await Course.findOneAndDelete( {slug: req.params.slug} );
    // Redirect to the courses page
    req.flash("success", `${course.name} deleted successfully`);
    res.status(200).redirect("/dashboard");

  } catch (error) {
    // Render the home page if there is an error
    req.flash("error", `Request failed.`);
    res.status(400).redirect("/");
  }
};

// Enroll a course
exports.enrollCourse = async (req, res) => {
  try {
    // Find the course by slug and enroll it
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();
    // Redirect to the same page
    res.status(200).redirect("back");

  } catch (error) {
    // Render the home page if there is an error
    req.flash("error", `Request failed.`);
    res.status(400).redirect("/");
  }
};

// Release a course
exports.releaseCourse = async (req, res) => {
  try {
    // Find the course by slug and release it
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();
    // Redirect to the same page
    res.status(200).redirect("back");

  } catch (error) {
    // Render the home page if there is an error
    req.flash("error", `Request failed.`);
    res.status(400).redirect("/");
  }
};
