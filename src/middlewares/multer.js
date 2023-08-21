const { log } = require('console');
const multer = require('multer');
const path = require('path');

const IMGDIR = path.join(__dirname,'../public/courses/images');
const VIDDIR = path.join(__dirname,'../public/courses/videos');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //checking the file type and store in the appropriate durectory
        if (file.mimetype === 'video/mp4' || file.mimetype === 'video/mkv') {
            cb(null, VIDDIR);
        } else if (file.mimetype.startsWith('image/')) {
            cb(null, IMGDIR);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
    filename: function(req, file, cb) {
        //set the file name and extension
        const ext = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
    },
});

const upload = multer({ storage });
module.exports = {
    upload
}