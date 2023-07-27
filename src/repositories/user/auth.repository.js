const userModel = require('../../models/userModel.js');

const findUserByEmail = async (email) => userModel.findOne({ email });
const createNewUser = async (user) => userModel.create(user);
const findUserWithPass = async (email) => userModel.findOne({ email })
const findUserForToken = async(email,token) => await userModel.findOneAndUpdate({email:email},{confirmationToken:token},{new:true});
const findUserWithEmail = async(id) => await userModel.findById({_id:id})

module.exports ={
    findUserByEmail,
    createNewUser,
    findUserWithPass,
    findUserForToken,
    findUserWithEmail
}