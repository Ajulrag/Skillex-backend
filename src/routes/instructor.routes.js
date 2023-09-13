const express = require('express');
const router = express.Router();
const { getAllCategories,submitCourse,getCourses,createCariculam } = require('../controllers/instructor/instructorCourse.controller')
const { upload } = require('../middlewares/multer');


router.get('/get-courses', getCourses)
router.get('/categories', getAllCategories);

router.post('/create-cariculam', upload.any('videoFile'), createCariculam);
router.post('/submit-course', upload.fields([{ name: 'course_image'}, {name: 'promotional_video'}]), submitCourse)


module.exports = router;
