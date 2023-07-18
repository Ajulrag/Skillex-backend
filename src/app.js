const express = require('express');
const app = express();
const logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const userAuthRoutes = require('./routes/user/auth.routes.js');
const userRoutes = require('./routes/user/user.routes.js');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', userRoutes);
app.use('/auth', userAuthRoutes);


module.exports = {app};
