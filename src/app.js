const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
dotenv.config();
const REACT = process.env.REACT;

const IMGDIR = path.join(__dirname, './public/courses/images');
const VIDDIR = path.join(__dirname, './public/courses/videos');

const indexRoutes = require('./routes/index.routes.js');
const adminRoutes = require('./routes/admin.routes.js');
const instructorRoutes = require('./routes/instructor.routes.js');

/*CONFIG*/
const app = express();


/*---If error occures not this...i have changed it.
app.use(express.urlencoded({extended: true}));

only this line.dint need next line
*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// Serve static files (images and videos)
// app.use(express.static(path.join(__dirname,"./public")))
app.use('/course-images', express.static(IMGDIR));
app.use('/course-videos', express.static(VIDDIR));

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', REACT);
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/instructor', instructorRoutes);



module.exports = { app, IMGDIR, VIDDIR };

