const isCompany = (req,res,next) => {

    // console.log('1111',req)
    const role = req.user.role;
    console.log("role",role);

    if(role !== 'company') {
        return res.status(400).json({
            success: false,
            message:"You are not Login wih Company mail",
            error: {
                details: "pleas re-login with Company Email"
            }
        });
    }
    next();

}


module.exports = { isCompany }