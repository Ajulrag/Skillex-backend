const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
dotenv.config();
const REACT = process.env.REACT;

console.log(REACT);

const indexRoutes = require('./routes/index.routes.js');
const adminRoutes = require('./routes/admin.routes.js');
const instructorRoutes = require('./routes/instructor.routes.js');

/*CONFIG*/
const app = express();
app.use(logger('dev'));
app.use(express.json());

/*---If error occures not this...i have changed it.
app.use(express.urlencoded({extended: true}));

only this line.dint need next line
*/
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', REACT);
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/instructor', instructorRoutes);



module.exports = {app};
