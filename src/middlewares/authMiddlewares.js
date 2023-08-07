const jwt = require('jsonwebtoken');
const { success, error, validation } = require('../utils/responseApi.js');
const User = require('../models/userModel.js');


module.exports = {
    //jwt token verification middleware
    tokenVerification : async(req,res,next) => {
        try{
            console.log('Entered for token verification');
            const token = req.headers['autherization']?.split(' ')[1]
            console.log(token)
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode,'decoded')
            const user = decode._id;
            console.log(user,'This is the user');
            req.user = user
            next();
        }catch (err) {  
            console.log(err);
            return res.status(403).json(error('User is unautherized, Please login as a valid user',res.statusCode))
        }
    },

    isBlocked:async(req,res,next) => {
        try {
            const user = await User.findOne({email:req.user});
            if(user.status){
                return res.status(403).json(error("Your account has been blocked"))
            }else{
                next()
            }
        } catch (error) {
            return res.status(500).json(error('Something went wrong, Try after sometimes'),res.statusCode)
        }
    }
}
