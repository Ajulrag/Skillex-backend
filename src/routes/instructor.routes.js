const express = require('express');
const router = express.Router();
const { getAllCategories,submitCourse,getCourses,createCariculam } = require('../controllers/instructor/instructorCourse.controller')
const { upload } = require('../middlewares/multer');


router.get('/categories', getAllCategories);
router.get('/get-courses', getCourses)
router.post('/submit-course', upload.fields([{ name: 'course_image'}, {name: 'promotional_video'}]), submitCourse)
router.post('/create-cariculam', upload.array("curriculam[][lectures][][video]"), createCariculam);


module.exports = router;
