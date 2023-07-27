const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  mobile: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  student:{
    type: Boolean,
    default: true
  },
  isInstructor: {
    type: Boolean,
    default: false
  },
  instructor_details:{
    experience_mode:{
     type:String,
    },
    experience_years:{
     type:String,
    }
 },
  status: {
    type: Boolean,
    default: false
  },
  createdAt:{
    type: Date,
    default: new Date()
  },
  profile_image:{
    type: String
  },
  confirmationToken: {
    type: String
  },
  instructor_details:{
    experience_mode:{
     type:String,
    },
    experience_years:{
     type:String,
    }
 },
 
},{timestamp:true});

module.exports = mongoose.model("users", userSchema);
