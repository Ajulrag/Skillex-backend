const { success, error, validation } = require('../../utils/responseApi');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel')

module.exports = {
    adminLogin:(req,res) => {
        try {
            const {email, password} = req.body;
            if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASS) {
                const token = jwt.sign({user:email,role:'admin'},process.env.JWT_SECRET)
                return res.status(200).json(success('OK',{token:token}))
            } else {
                return res.status(403).json(error('Invalid Email or Password, Try again...'))

            }
        } catch (error) {
            return res.status(500).json(error('Something went wrong, Try after sometimes'))
        }
    },

    getAllUsers:async(req,res)=>{
        try{
            const users = await User.find({isInstructor:false});
            return res.status(200).json(success("OK",{users:users}));
        }catch(err){
            return res.status(500).json(error('Something went wrong, Try after sometimes'));
        }
    },

    getAllInstructors:async(req,res) => {
        try{
            const instructors = await User.find({isInstructor:true});
            return res.status(200).json(success("OK",{instructors:instructors}));
        } catch (err) {
            return res.status(500).json(error('Something went wrong, Try after sometimes'));
        }
    },

    updateInstructorStatus: async(req,res) => {
        try {
            const instructor = req.params.id;
            const status = req.query.status;
            //checking whether the instructor esists
            const isExist = await User.findOne({_id:instructor})
            if(!isExist) {
                return res.status(404).json(error('User not found'));
            }
            //updating the user status
            isExist.status = status;
            await isExist.save();
            return res.status(200).json(success('OK'))
        } catch (err) {
            return res.status(500).json(error('Something went wrong, Please try again after some times'))
            
        }
    }
}