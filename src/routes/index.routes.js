const express = require('express');
const router = express.Router();
const { tokenVerification } = require('../middlewares/authMiddlewares');
const {insrtructorSignUp} = require('../controllers/instructor/instructorAuth.controller')
const { userSignUp,userLogin,verifyEmail,verifyToken,forgotPassword,resetPassword,getUserProfile,statusCheck,updateProfile,fetchSingleCourse } = require('../controllers/user/auth.controller');



router.get('/', (req,res) => {
    res.json('welcome home')
})
router.post('/login', userLogin);
router.post('/signup', userSignUp);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password',forgotPassword)
router.post('/verify-token',verifyToken)

// router.get('/resend-email/:id', resendEmail)
router.get('/user/confirm?', verifyEmail)
router.get('/user/check-status/:id',statusCheck)
router.get('/sigle-course/:id', fetchSingleCourse)
router.get('/getprofile',tokenVerification, getUserProfile)

router.put('/reset-password/',resetPassword)
router.put('/user/update-profile',updateProfile)
router.put('/instructor/signup',tokenVerification, insrtructorSignUp)

module.exports = router;