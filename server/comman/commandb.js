const comman = {

    async signUp(model, data) {

        try {

            // const newUser = new userModel({
            //     userId: userLastId.userId,
            //     username: user.username,
            //     email: user.email,
            //     password: user.password
            // })

            console.log('inner signup in commaDB')
            return true;
            // return await newUser.save();

        }
        catch (err) {

        }
    },


    async googleLogin(model, data) {

        try {
            const { email, username, provider } = data;

            // 1. Check if user already exists
            let user = await model.findOne({ email });

            if (!user) {
                // 2. Create a new user if not found
                const newUser = new model({
                    email,
                    username,
                    provider,
                    // We don't have a password for Google users
                });
                user = await newUser.save();
            }

            // 3. Return the user (whether new or existing)
            return user;
        }
        catch (err) {
            console.error("Error in googleLogin helper:", err);
            throw err;
        }
    }

}



module.exports = comman;