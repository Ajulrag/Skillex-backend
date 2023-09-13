const Course = require("../../models/courseModel");
const { error, success } = require("../../utils/responseApi");

module.exports = {
  getAllCourses: async (req, res) => {
    try {
      const courses = await Course.find();

      // Map courses to include image URLs
      const coursesWithImageUrls = courses.map((course) => ({
        ...course.toObject(),
        course_image: `${course.course_image}`,
        promotional_video: `${course.promotional_video}`,
      }));

      return res.status(200).json(success("All courses details", { courses: coursesWithImageUrls }));
    } catch (err) {
      return res.status(500).json(error("Something went wrong, Try again later."));
    }
  },

  getCourse: async (req, res) => {
    try {
      const id = req.params.id;
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json(error("Course not found."));
      }
      return res.status(200).json(success("Course details", { course }));
    } catch (err) {
      return res.status(500).json(error("Something went wrong, Try again later."));
    }
  },

  updateCourseStatus: async (req, res) => {
    try {
      const newStatus = req.query.status;
      const course_id = req.params.id;
      const updatedCourse = await Course.findByIdAndUpdate(
        { _id: course_id },
        { status: newStatus }
      );

      if (!updatedCourse) {
        return res.status(404).json(error("Course not found."));
      }

      return res.status(200).json(success("Course status updated", { data: updatedCourse }));
    } catch (err) {
      return res.status(500).json(error("Something went wrong, Try again later."));
    }
  },

  getPendingCourses: async (req, res) => {
    try {
      const pendingCourses = await Course.find({ isApproved: "Pending" })
      // Map courses to include image URLs
      const coursesWithImageUrls = pendingCourses.map((course) => ({
        ...course.toObject(),
        course_image: `${course.course_image}`,
        promotional_video: `${course.promotional_video}`,
      }));

      return res.status(200).json(success("Pending courses for approval", { courses: coursesWithImageUrls }));
    } catch (err) {
      return res.status(500).json(error("Something went wrong, Try again later."));
    }
  },


  approveCourse: async (req, res) => {
    try {
      const course_id = req.params.id;
      const approval = "Approved"
      const approveCourse = await Course.findByIdAndUpdate(
        { _id: course_id },
        { isApproved: approval }
      );
      if (!approveCourse) {
        return res.status(404).json(error("Course not found."));
      }
      return res.status(200).json(success("Course approved", { data: approveCourse }));
    } catch (err) {
      return res.status(500).json(error("Something went wrong, Try again later."));
    }
  }
};
