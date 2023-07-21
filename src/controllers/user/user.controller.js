const userServices = require('../../services/user/user.services.js');
const { catchAsync } = require('../../utils/errors/catchAsync.js');

const getHome = catchAsync(async(req, res) => {
    res.json({status: true})
})

module.exports = {
    getHome
}
