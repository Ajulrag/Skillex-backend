const Category = require('../../models/categoryModel');
const { error, success } = require("../../utils/responseApi");
const Courses = require('../../models/courseModel');

module.exports = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({ status: "Active" });
      // console.log(categories);
      return res.status(200).json(success("OK", { categories }));
    } catch (err) {
      console.log(err);
      return res.status(500).json(error("Something went wrong, Try after sometime"));
    }
  },

  submitCourse: async (req, res) => {
    try {
      // Extract data from the request body
      const {
        course_title,
        course_subtitle,
        description,
        duration,
        category,
        price,
        saleprice,
        tutor_name,
        tutor_email,
      } = req.body;
  
      // Access uploaded files
      const courseImageFile = req.files['course_image'][0];
      const promotionalVideoFile = req.files['promotional_video'][0];
      
      // Construct the S3 object URLs
      const courseImageUrl = courseImageFile.location;
      const promotionalVideoUrl = promotionalVideoFile.location;

      
      // Create a new course instance with only the S3 object locations
      const newCourse = new Courses({
        course_title,
        course_subtitle,
        description,
        duration,
        promotional_Video: promotionalVideoUrl, // Store the S3 URL
        course_image: courseImageUrl, // Store the S3 URL
        tutor_name,
        tutor_email,
        category,
        price,
        saleprice,
      });
  
      // Save the course to the database
      const savedCourse = await newCourse.save();
      console.log(savedCourse._id);
  
      return res.status(200).json(success("Course created successfully", { courseId: savedCourse._id }));
    } catch (err) {
      console.error(err);
      return res.status(500).json(error("Something went wrong, Try after sometime"));
    }
  },
  

  getCourses: async (req, res) => {
    try {
      console.log("rec");
      const courses = await Courses.find({ isApproved: "Approved", status: "Active" })
      console.log(courses);
      return res.status(200).json(success("OK", { courses }));
    } catch (err) {
      return res.status(500).json(error("Something went wrong, Try after sometime"));
    }
  },

  createCariculam: async (req, res) => {
    try {
      const { courseId, sections } = req.body;
      console.log(req.body.curriculam[0].videos, "I am request===========================================");
      console.log(req.files, "I ama videos")

      // // Find the course by its ID
      const course = await Courses.findById(courseId);

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // // Process uploaded video files and store their paths
      const videoFiles = req.files.map((file) => {
        return {
          title: file.originalname,
          path: file.path,
        };
      });

      // // Update the curriculum with the uploaded video files
      sections.forEach((section, sectionIndex) => {
        section.videos.forEach((video, videoIndex) => {
          if (videoFiles.length > 0) {
            const uploadedVideo = videoFiles.shift();
            video.title = uploadedVideo.title;
            video.videoFile = uploadedVideo.path;
          }
        });
      });

      // // Save the course with the updated curriculum
      await course.save();

      res.status(200).json({ message: 'Curriculum uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading curriculum:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
