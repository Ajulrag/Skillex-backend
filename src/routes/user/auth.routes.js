const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user/auth.controller.js');

router.get('/', controller.getLogin);
router.post('/login', controller.login);
router.get('/signup', controller.getSignup);
router.post('/signup', controller.signup);


module.exports={router};
