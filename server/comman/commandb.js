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
    },


    async createSurvey(Survey, Question, data) {

        try {

            console.log('inner create survey data', data);

            const { title, description } = data;

            const counter = await Counter.findOneAndUpdate(
                { collectionName: Survey.modelName },
                { $inc: { count: 1 } },
                { new: true, upsert: true }
            );

            console.log('last counter number', counter.count);


            const newSurvey = new Survey({
                surveyName: title,
                description: description,
                companyId: '69c51fb1c8fda1f6a1cfcd55', // :TODO change it after you implement the token
                surveyId: counter.count
            })

            await newSurvey.save();


            // half done. create one array push all the id created by question and after that go iterate the that array and push it into survey.questions
            // for (const question of questions) {

            //     if (question.type === 'TEXT') {

            //         const counter = await Counter.findOneAndUpdate(
            //             { collectionName: Question.modelName },
            //             { $inc: { count: 1 } },
            //             { new: true, upsert: true }
            //         );
            //         console.log('Last count ', counter.count);

            //         const newQuestion = new Question({
            //             questionKey: counter.count,
            //             questionText: question.text,
            //             questionType: question.type,
            //             surveyId: '69c659f932e3661b4e190c67'
            //         })

            //     }
            //     else if (question.type === 'MCQ') {

            //     }
            //     else {

            //     }
            // }

            return {
                statusCode: 201,
                success: true,
                message: "Survey created succesfully",
                data: newSurvey
            };
        }
        catch (err) {
            console.error("Error in creating survey:-", err);
            return {
                statusCode: 500,
                success: false,
                message: "Survey created unsuccesful",
                error: {
                    details: err
                }
            };
        }


    }
}


module.exports = comman;