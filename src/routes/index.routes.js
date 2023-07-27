const express = require('express');
// const { userRegistration,verifyEmail,resendEmail,userLogin,verifyToken,resetPassword,forgotPassword,verifyResetEmail} = require('../controllers/user/auth.controller');
const { tokenVerification } = require('../middlewares/authMiddlewares');
const { userSignUp,userLogin,verifyEmail,verifyToken,resendEmail } = require('../controllers/user/auth.controller');
const {insrtructorSignUp} = require('../controllers/instructor/instructorAuth.controller')
const router = express.Router();




router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.post('/verify-email', verifyEmail);
router.post('/verify-token',verifyToken)

router.get('/resend-email/:id', resendEmail)
router.get('/user/confirm?', verifyEmail)

router.put('/instructor/signup',tokenVerification, insrtructorSignUp)


module.exports = router;