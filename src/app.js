const express = require('express');
const app = express();
const logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const userRoutes = require('./routes/user/user.routes.js');
const userAuthRoutes = require('./routes/user/auth.routes.js');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', userRoutes);
app.get('/auth', userAuthRoutes);


module.exports = {app};
