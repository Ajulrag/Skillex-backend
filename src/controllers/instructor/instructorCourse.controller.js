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
            console.log("dfgsdfgfdgfd");
            // Extract data from the request body
            const {
                course_title,
                course_subtitle,
                description,
                duration,
                category,
                price,
                saleprice
            } = req.body;

            // Create a new course instance
            const newCourse = new Courses({
                course_title,
                course_subtitle,
                description,
                duration,
                promotional_Video: req.files['promotional_video'][0].filename,
                course_image: req.files['course_image'][0].filename,
                tutor_name: req.body.tutor_name,
                tutor_email: req.body.tutor_email,
                category,
                price,
                saleprice
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
            console.log('req.body', req.body);
            console.log('req.files', req.files);
            const { courseId } = req.body;

            const course = await Courses.findById(courseId)




            course.curriculam = req.body.curriculam;


            const updatedCourse = await course.save();

            console.log(updatedCourse);




            return res.status(200).json(success("Curriculum created successfully", { course: updatedCourse }));
        } catch (err) {
            console.error(err);
            return res.status(500).json(error("Something went wrong, Try after sometime"));
        }
    }
}
