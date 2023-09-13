const jwt = require('jsonwebtoken');
const User = require('../../models/userModel')
const { success, error } = require('../../utils/responseApi');

module.exports = {
    adminLogin:(req,res) => {
        try {
            const {email, password} = req.body;
            if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASS) {
                const token = jwt.sign({user:email,role:'admin'},process.env.JWT_SECRET)
                return res.status(200).json({msg:'Admin logged in',token:token})
            } else {
                return res.json({msg:'Invalid Email or Password, Try again...'}).status(403)

            }
        } catch (error) {
            return res.json({msg:'Something went wrong, Try after sometimes'}).status(500)
        }
    },

    getAllUsers:async(req,res)=>{
        try{
            const users = await User.find({isInstructor:false});
            return res.status(200).json(success("All users details",{users:users}));
        }catch(err){
            return res.status(500).json(error('Something went wrong, Try after sometimes'));
        }
    },

    getAllInstructors:async(req,res) => {
        try{
            const instructors = await User.find({isInstructor:true});
            return res.status(200).json(success("All instructors details",{instructors:instructors}));
        } catch (err) {
            return res.status(500).json(error('Something went wrong, Try after sometimes'));
        }
    },

    updateInstructorStatus: async(req,res) => {
        try {
            const instructor = req.params.id;
            const status = req.query.status;
            const Instructor = await User.findOne({_id:instructor});
            if(!Instructor) {
                return res.status(404).json(error('Instructor not found'));
            }
            //updating the user status
            Instructor.status = status;
            await Instructor.save();
            return res.status(200).json(success('Instructor status updated'))
        } catch (err) {
            return res.status(500).json(error('Something went wrong, Please try again after some times'))
            
        }
    }
}