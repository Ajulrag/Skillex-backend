const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/admin/adminAuth.js');
const { tokenVerification } = require('../middlewares/authMiddlewares.js')
const {updateUserStatus,editUser } = require('../controllers/admin/userManagment.controller.js')
const {adminLogin,getAllInstructors,updateInstructorStatus} = require('../controllers/admin/adminAuth.js');
const {addCategory,getAllCategories,getCategory,updateCategoryStatus,editCategory} = require('../controllers/admin/category.controller.js')
const {getAllCourses,updateCourseStatus,getCourse,getPendingCourses,approveCourse} = require('../controllers/admin/courseManagment.controller.js')

router.get('/users',getAllUsers)
router.get('/get-courses', getAllCourses)
router.get('/categories', getAllCategories)
router.get('/instructors',getAllInstructors)
router.get('/courses/getcourse/:id',getCourse)
router.get('/categories/category/:id', getCategory)
router.get('/courses/pending-courses', getPendingCourses)

router.post('/',adminLogin);
router.post('/categories/create', addCategory)

router.put('/users/status/:id',updateUserStatus)
router.put('/users/edit/:id', tokenVerification, editUser)
router.put('/courses/course/status/:id', updateCourseStatus)
router.put('/instructors/status/:id', updateInstructorStatus)
router.put('/courses/pendingcourse/approval/:id', approveCourse)
router.put('/categories/category/editcategory/:id', editCategory)
router.put('/categories/category/status/:id', updateCategoryStatus)

module.exports = router;