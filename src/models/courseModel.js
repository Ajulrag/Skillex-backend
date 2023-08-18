const mongoose = require('mongoose')

const Sections = {
    section_title: {
        type: String,
        required:true
    },
    section_description: {
        type: String,
        required: true
    },
    lectures: [{
        lecture_title:{
            type: String,
            required: true
        },
        video:{
            type: String,
            required: true
        },
    }]
}

const Courses = mongoose.model('Courses',new mongoose.Schema({
    course_title: {
        type: String,
        required: true,
        unique: true
    },
    course_subtitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "Inactive"
    },
    isApproved:{
        type:String,
        default:"Pending",
    },
    promotional_Video: {
        type: String,
        required: true
    },
    course_image:{
        type:String,
        required:true
    },
    isFree: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
    },
    salePrice: {
        type: Number,
    },
    tutor:{
        type:mongoose.Types.ObjectId,
        ref: 'Users',
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref: 'Category',
    },
    curriculam:[
        Sections
    ]

}))

module.exports = Courses