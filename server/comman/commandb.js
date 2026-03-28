const bcrypt = require("bcrypt");
const Counter = require("../models/counter");
const { v4: uuidv4 } = require('uuid');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtil');



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

            const token = generateAccessToken(getUserData, model.modelName);
            const RefreshToken = generateRefreshToken(getUserData._id);

            return {
                statusCode: 200,
                success: true,
                message: "Login sucessful",
                data: {
                    userName: getUserData.userName,
                    role: getUserData.role
                },
                refreshToken: RefreshToken,
                accessToken: token
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

            const token = generateAccessToken(user, model.modelName);
            const RefreshToken = generateRefreshToken(user._id);

            
            return {
                statusCode: 200,
                success: true,
                data: {
                    userName: user.userName,
                    role: user.role
                },
                refreshToken: RefreshToken,
                accessToken: token
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

            const surveyId = uuidv4(); 


            const newSurvey = new Survey({
                surveyName: title,
                description: description,
                companyId: '69c6c792ed1861836dc6eea0', // :TODO change it after you implement the token
                surveyId: counter.count,
                surveyLink: surveyId
            })

            await newSurvey.save();

            
            const questionIds = [];
            for (const question of data.questions) {

                const counter = await Counter.findOneAndUpdate(
                    { collectionName: Question.modelName },
                    { $inc: { count: 1 } },
                    { new: true, upsert: true }
                );
                console.log('Last count ', counter.count);

                if (question.type === 'TEXT') {

                    const newQuestion = new Question({
                        questionKey: counter.count,
                        questionText: question.text,
                        questionType: question.type,
                        surveyId: '69c6c80e3528ab85962ddeb9' // :TODO change it after you implement the token
                    })
                    questionIds.push(newQuestion._id);

                    await newQuestion.save();
                }
                else {

                    const options = [];
                    for(const option of question.options){
                        options.push(option.value);
                        console.log('option', option);
                    }

                    const newQuestion = new Question({
                        questionKey: counter.count,
                        questionText: question.text,
                        questionType: question.type,
                        surveyId: '69c6c80e3528ab85962ddeb9', // :TODO change it after you implement the token
                        options: options
                    })
                    questionIds.push(newQuestion._id);

                    await newQuestion.save();
                }
            }

            await Survey.findByIdAndUpdate(newSurvey._id, { $push: { questions: { $each: questionIds } } });

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