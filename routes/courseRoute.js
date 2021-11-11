// Import modules
const express = require("express");
const courseController = require("../controllers/courseController");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Create router
const router = express.Router();

// .../courses/
router.route("/")
    // Get all courses
    .get(courseController.getAllCourses)

    // Create a new course
    .post(
        roleMiddleware(["teacher", "admin"]),
        courseController.createCourse
    )
;

// .../courses/:slug
router.route("/:slug")
    // Get a single course
    .get(courseController.getCourse)
    // Update a course
    .put(courseController.updateCourse)
    // Delete a course
    .delete(courseController.deleteCourse)
;

router.route("/enroll")
    // Enroll a student in a course
    .post(courseController.enrollCourse)
;

router.route("/release")
    // Release a student from a course
    .post(courseController.releaseCourse)
;


// Export the router
module.exports = router;
