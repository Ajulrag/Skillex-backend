const express = require('express');
const { getAllUsers } = require('../controllers/admin/adminAuth.js');
const { tokenVerification } = require('../middlewares/authMiddlewares.js')
const {adminLogin,getAllInstructors,updateInstructorStatus} = require('../controllers/admin/adminAuth.js');
const {updateUserStatus,editUser } = require('../controllers/admin/userManagment.controller.js')
const {getAllCourses,updateCourseStatus,getCourse,getPendingCourses,approveCourse} = require('../controllers/admin/courseManagment.controller.js')
const {addCategory,getAllCategories,getCategory,updateCategoryStatus,editCategory} = require('../controllers/admin/category.controller.js')
const router = express.Router();

router.post('/',adminLogin);
router.get('/users',getAllUsers)
router.get('/instructors',getAllInstructors)
router.get('/get-courses', getAllCourses)
router.get('/courses/getcourse/:id',getCourse)
router.get('/courses/pending-courses', getPendingCourses)
router.put('/instructors/status/:id', updateInstructorStatus)

router.put('/users/status/:id',updateUserStatus)
router.put('/users/edit/:id', tokenVerification, editUser)

router.post('/categories/create', addCategory)
router.get('/categories', getAllCategories)
router.get('/categories/category/:id', getCategory)
router.put('/categories/category/status/:id', updateCategoryStatus)
router.put('/courses/course/status/:id', updateCourseStatus)
router.put('/courses/pendingcourse/approval/:id', approveCourse)
router.put('/categories/category/editcategory/:id', editCategory)

module.exports = router;