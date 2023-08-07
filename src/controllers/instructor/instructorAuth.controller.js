const User = require('../../models/userModel.js');
const { success, error, validation } = require("../../utils/responseApi.js");
const jwt = require('jsonwebtoken');


const insrtructorSignUp = async(req,res) => {
    try {
        const {experience_years,field_of_study} = req.body;
        console.log(req.user,"======================");
        //updating the experience details
        const response = await User.findOneAndUpdate(
            {_id:req.user},
            { instructor_details: { experience_years, field_of_study}, isInstructor: true},
            { new: true}
        )
        console.log(response);
        if(response.isInstructor) {
            const token = jwt.sign({user:response.email,role:"instructor"},process.env.JWT_SECRET,{expiresIn:"24hr"})
            return res.status(200).json(success("OK",{token:token},res.statusCode))
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(error("Something went wrong, Please try after sometimes..."))
    }
}

module.exports = {
    insrtructorSignUp
}