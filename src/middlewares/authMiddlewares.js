const jwt = require('jsonwebtoken');
const { success, error, validation } = require('../utils/responseApi.js');
const User = require('../models/userModel.js');


module.exports = {
    tokenVerification : async(req,res,next) => {
        try{
            const token = req.headers['autherization']?.split(' ')[1]

            const decode = jwt.verify(token,process.env.JWT_SECRET);
            const user = decode._id;
            req.user = user
            next();
        }catch (err) {
            return res.status(403).json(error('User is unautherized, Please login as a valid user',res.statusCode))
        }
    },

    isBlocked:async(req,res,next) => {
        try {
            const user = await User.findOne({email:req.user});
            if(user.status === 'Inactive'){
                return res.json({msg:'Something went wrong, Please try after sometimes'}).status(200)
            }else{
                next()
            }
        } catch (err) {
            return res.json({msg:'Something went wrong, Please try after sometimes'}).status(200)
        }
    }
}
