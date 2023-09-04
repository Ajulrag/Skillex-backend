const Course = require('../../models/courseModel');
const { error,success } = require("../../utils/responseApi");

module.exports = {
    getAllCourses: async (req,res) => {
        try {
            const courses = await Course.find();
            return res.status(200).json(success("OK",{courses:courses}))
        } catch (err) {
            return res.status(500).json(error("Something went wrong, Try after sometimes"))
        }
    },

    updateCourseStatus: async(req,res) => {
        try {
            const newStatus = req.query.status;
            console.log(newStatus);
            const course_id = req.params.id;
            const updatedCourse = await Course.findByIdAndUpdate({_id:course_id},{status:newStatus})
            return res.status(200).json(success("OK",{data:updatedCourse}));
        } catch (err) {
            return res.status(500).json(error('Something went wrong, Please try again after some times'))
            
        }
    }
}