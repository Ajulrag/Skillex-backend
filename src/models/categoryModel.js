const mongoose = require('mongoose');

const Category = mongoose.model('Category',new mongoose.Schema({
    category_name:{
        type:String,
        unique:true,
    },
    category_description:{
        type:String
    },
    status:{
        type:String,
        default:"Active"
    },
    
},{ timestamps: true }))

module.exports = Category;