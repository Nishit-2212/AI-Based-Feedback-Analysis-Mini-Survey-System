const bcrypt = require("bcrypt");
const Counter = require("../models/counter");

const comman = {

    async signUp(model, data) {

        try {
            console.log('inner commanDb data', data)
            const emailExists = await model.findOne({ email: data.email })
            console.log(emailExists);
            if (emailExists) {
                return {
                    statusCode: 400,
                    success: false,
                    message: "Email already exist please login",
                };
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.password, salt);

            const counter = await Counter.findOneAndUpdate(
                { collectionName: model.modelName },
                { $inc: { count: 1 } },
                { new: true, upsert: true }
            );

            console.log('Counter ', counter.count);
            console.log('Model ', model)

            const modelName = model.modelName;
            const idField = modelName.toLowerCase() + "Id";

            const newUser = new model({
                ...data,
                password: hashedPassword,
                [idField]: counter.count
            });



            await newUser.save();



            return {
                statusCode: 201,
                success: true,
                message: "signUp succesfully",
                data: newUser
            };
        } catch (err) {
            console.error("Error in createUser:-", err);
            return {
                statusCode: 500,
                success: false,
                message: "SignedUp unsuccesful",
                error: {
                    details: err
                }
            };
        }
    },


    async login(model, data) {

        try {

            const getUserData = await model.findOne({ email: data.email })

            console.log("getUserData", getUserData)

            if (!getUserData) {
                return {
                    statusCode: 404,
                    success: false,
                    message: "Email is not found"
                };
            }

            let { password } = data
            let storedPassword = getUserData.password;
            console.log("pass,store", password, storedPassword);
            const passwordMatched = await bcrypt.compare(password, storedPassword);


            if (!passwordMatched) {
                return {
                    statusCode: 400,
                    succes: false,
                    message: "password is incorrect"
                };
            }

            // const token = generateAccessToken(getUserData);
            // const RefreshToken = generateRefreshToken(getUserData._id);

            // res.cookie('refreshToken', RefreshToken, {
            //     httpOnly: true,
            //     sameSite: "None",
            //     secure: true,
            //     maxAge: 7 * 24 * 60 * 60 * 1000, //7 Day
            //     path: "/"
            // });

            // res.cookie('accessToken', token, {
            //     httpOnly: true,
            //     sameSite: "None",
            //     secure: true,
            //     maxAge: 1 * 24 * 60 * 60 * 1000, //1 Day
            //     path: "/"
            // });

            // console.log(res)

            return {
                statusCode: 200,
                success: true,
                message: "Login sucessful",
                data: {
                    userName: getUserData.userName,
                    role: getUserData.role
                }
            }
        }
        catch (err) {
            console.log("Something goes wrong while login", err);
            return {
                statusCode: 500,
                success: false,
                message: "Login unsuccesful",
                error: {
                    details: err
                }
            };
        }
    },


    async googleLogin(model, data) {

        try {
            const { email, userName, provider } = data;

            let user = await model.findOne({ email });

            if (!user) {
                const newUser = new model({
                    email,
                    userName,
                    provider,
                });
                user = await newUser.save();
            }

            return user;
        }
        catch (err) {
            console.error("Error in googleLogin helper:", err);
            throw err;
        }
    }
}

/* okay so i have dought regarding the file structure in angular so basically i have two user one is admin and second one is user now 
    now currently i have component based structure i have feature,services,models,shared folder in the features folder if auth folder in that i have login and logout component.
    and in shared folder i have component folder in that i have navbar component and this navbar component i am using it globally in app.html like this <app-navbar></app-navbar>
<main>
  <router-outlet></router-outlet>
</main>
    .so in my website i have to show the navbar globally in every page. but when the admin is logged in my website it shows the side bar in that there so many functionality that i show but side bar only shows in the
    company login and admin user. not in the simple user role. in the simple user role i just want show the navbar with user related features. now how can i design this strucutre can just go through with basic design with file structure so that i can 
    understand
*/
module.exports = comman;