const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user/user.controller.js');

router.get('/', controller.getHome);

module.exports = {router};
