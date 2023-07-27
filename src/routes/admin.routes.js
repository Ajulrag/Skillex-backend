const express = require('express');
const { getAllUsers } = require('../controllers/admin/adminAuth.js');
const { tokenVerification } = require('../middlewares/authMiddlewares.js')
const {adminLogin,getAllInstructors,updateInstructorStatus} = require('../controllers/admin/adminAuth.js');
const {updateUserStatus,editUser } = require('../controllers/admin/userManagment.controller.js')
const {addCategory,getAllCategories,getCategory,updateCategoryStatus,editCategory} = require('../controllers/admin/category.controller.js')
const router = express.Router();

router.post('/',adminLogin);
router.get('/users', tokenVerification,getAllUsers)
router.get('/instructors', tokenVerification,getAllInstructors)
router.put('/instructors/status/:id', tokenVerification, updateInstructorStatus)

router.put('/users/status/:id', tokenVerification,updateUserStatus)
router.put('/users/edit/:id', tokenVerification, editUser)

router.post('/categories/create', tokenVerification, addCategory)
router.get('/categories', tokenVerification, getAllCategories)
router.get('/categories/category/:id', tokenVerification, getCategory)
router.put('/categories/category/status/:id',tokenVerification, updateCategoryStatus)
router.put('/categories/category/editcategory/:id', tokenVerification, editCategory)

module.exports = router;