const express = require('express');
const { getAllUsers } = require('../controllers/admin/adminAuth.js');
const { tokenVerification } = require('../middlewares/authMiddlewares.js')
const {adminLogin,getAllInstructors,updateInstructorStatus} = require('../controllers/admin/adminAuth.js');
const {updateUserStatus,editUser } = require('../controllers/admin/userManagment.controller.js')
const {addCategory,getAllCategories,getCategory,updateCategoryStatus,editCategory} = require('../controllers/admin/category.controller.js')
const router = express.Router();

router.post('/',adminLogin);
router.get('/users', tokenVerification,getAllUsers)
router.get('/instructors',getAllInstructors)
router.put('/instructors/status/:id', updateInstructorStatus)

router.put('/users/status/:id', tokenVerification,updateUserStatus)
router.put('/users/edit/:id', tokenVerification, editUser)

router.post('/categories/create', addCategory)
router.get('/categories', getAllCategories)
router.get('/categories/category/:id', getCategory)
router.put('/categories/category/status/:id', updateCategoryStatus)
router.put('/categories/category/editcategory/:id', editCategory)

module.exports = router;