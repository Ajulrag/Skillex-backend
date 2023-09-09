const express = require('express');
// const { userRegistration,verifyEmail,resendEmail,userLogin,verifyToken,resetPassword,forgotPassword,verifyResetEmail} = require('../controllers/user/auth.controller');
const { tokenVerification } = require('../middlewares/authMiddlewares');
const { userSignUp,userLogin,verifyEmail,verifyToken,forgotPassword,resetPassword,getUserProfile,statusCheck,updateProfile } = require('../controllers/user/auth.controller');
const {insrtructorSignUp} = require('../controllers/instructor/instructorAuth.controller')
const router = express.Router();



router.get('/', (req,res) => {
    res.json('welcome home')
})
router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password',forgotPassword)
router.put('/reset-password/',resetPassword)

router.post('/verify-token',verifyToken)

// router.get('/resend-email/:id', resendEmail)
router.get('/user/confirm?', verifyEmail)
router.get('/getprofile',tokenVerification, getUserProfile)
router.get('/user/check-status/:id',statusCheck)

router.put('/instructor/signup',tokenVerification, insrtructorSignUp)
router.put('/user/update-profile',updateProfile)

module.exports = router;