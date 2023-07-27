const { success, error, validation } = require('../../utils/responseApi');
const User = require('../../models/userModel');


module.exports = {
    updateUserStatus:async (req,res) => {
        try {
            console.log(req.params.id);
            const user = req.params.id;
            const status = req.query.status
            //checking whether the user esists
            const isExist = await User.findOne({_id:user})
            if(!isExist) {
                return res.status(404).json(error('User not found'));
            }
            //updating the user status
            isExist.status = status;
            await isExist.save();
            return res.status(200).json(success('OK'))
        } catch (err) {
            console.log(err);
            return res.status(500).json(error('Something went wrong, Try after sometimes'))
        }
    },

    editUser: async(req,res) => {
        try {
            const {name,mobile} = req.body;
            const user = await User.findByIdAndUpdate({_id:req.params.id},{name:name,mobile:mobile})
            return res.status(200).json(success('User Updated',{data:user}))
        } catch (err) {
            return res.status(500).json(success('Somethig went wrong, Please try after sometimes'))
        }
    }
}