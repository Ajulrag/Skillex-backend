const userAuthServices = require('../../services/user/userAuth.services.js')

const getLogin = async(req, res) => {
    res.status(200).json(success('OK'));
}

module.exports = {getLogin}