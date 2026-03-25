const User = require('../models/user.js')

const userSignup = async(req,res) => {

    const user = await User.signUp(req.body)
    res.status(201).json({ data: user, message: 'user is created'})

}


module.exports = { userSignup }


