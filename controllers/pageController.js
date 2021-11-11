// Import modules
const nodemailer = require("nodemailer");
const config = require("../config/config");
const User = require("../models/User");
const Course = require("../models/Course");

// Get index page
exports.getIndexPage = async (req, res) => {
  // Get last 2 courses
  const courses = await Course.find({}).sort("-createdAt").limit(2);
  // Get total course count
  const totalCourses = await Course.find().countDocuments();
  // Get total student count
  const totalStudents = await User.find().countDocuments({role: "student"});
  // Get total teacher count
  const totalTeachers = await User.find().countDocuments({role: "teacher"});
  // Render index page
  res.status(200).render("index", {
    pageName: "home",
    courses,
    totalCourses,
    totalStudents,
    totalTeachers
  });
};

// Get about page
exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    pageName: "about"
  });
};

// Get contact page
exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    pageName: "contact"
  });
};

// Get register page
exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    pageName: "register"
  });
};

// Get login page
exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    pageName: "login"
  });
};

// Send contact form
exports.sendContactForm = async (req, res) => {
  try {
    // Create transporter
    const outputMessage =`
    <h1>Mail Details</h1>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h1>Message</h1>
    <p>${req.body.message}</p>
    `;
    // Create mail options
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.conf.user, // gmail acount
        pass: config.conf.pass, // gmail password
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"SmartEDU Contact Form" <coskntkk@gmail.com>', // sender address
      to: "coskntkk@gmail.com, caglasahin180999@gmail.com", // list of receivers
      subject: "SmartEDU Contact Form new message ✔", // Subject line
      html: outputMessage, // html body
    });
    // Redirect to contact page
    req.flash("success", "Your message has been sent successfully!");
    res.status(200).redirect("/contact");

  } catch (error) {
    // Redirect to contact page if error
    req.flash("error", "Email could not send!");
    res.status(200).redirect("/contact");
  }
};
