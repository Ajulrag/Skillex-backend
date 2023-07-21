const {Router } = require('express');
const router = Router();
const controller = require('../../controllers/user/auth.controller.js');

router.get('/login', controller.getLogin);
router.post('/login', controller.login);
router.get('/signup', controller.getSignup);
router.post('/signup', controller.signup);



module.exports={router};
