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
                    statusCode: 401,
                    success: false,
                    message: "password is incorrect"
                };
            }

            const token = generateAccessToken(getUserData, model.modelName);
            const RefreshToken = generateRefreshToken(getUserData._id, model.modelName);

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


    async getUserById(model, id) {
        try {
            const user = await model.findById(id, { password: 0, createdAt: 0, updatedAt: 0 });
            return {
                statusCode: 200,
                success: true,
                message: "User fetched succesfully",
                data: user
            };
        }
        catch (err) {
            console.error("Error in fetching User:-", err);
            return {
                statusCode: 500,
                success: false,
                message: "User fetched unsuccesful",
                error: {
                    details: err
                }
            };
        }
    },


    async createSurvey(Survey, Question, data, companyId) {

        try {

            console.log('inner create survey data', data);

            // const companyId = req.user.id;

            const { title, description, textAnalyzer } = data;

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
                companyId: companyId,
                surveyId: counter.count,
                surveyLink: surveyId,
                textAnalyzer: textAnalyzer
            })

            await newSurvey.save();

            const questionIds = [];
            const allQuestionsData = [];

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
                        surveyId: newSurvey._id,
                        isAiGenerated: false
                    })

                    allQuestionsData.push({ text: question.text, type: question.type });
                    questionIds.push(newQuestion._id);

                    await newQuestion.save();
                }
                else {

                    const options = [];
                    for (const option of question.options) {
                        options.push(option.value);
                        console.log('option', option);
                    }

                    const newQuestion = new Question({
                        questionKey: counter.count,
                        questionText: question.text,
                        questionType: question.type,
                        surveyId: newSurvey._id,
                        isAiGenerated: false,
                        options: options
                    })

                    allQuestionsData.push({ text: question.text, type: question.type });
                    questionIds.push(newQuestion._id);

                    await newQuestion.save();
                }
            }

            await Survey.findByIdAndUpdate(newSurvey._id, { $push: { questions: { $each: questionIds } } });

            if (textAnalyzer) {
                try {
                    const { generateQuestions } = require('../utils/openaiUtil');

                    console.log('TextAnalyzer is enabled. Generating AI questions...');

                    // Call OpenAI API
                    const aiQuestions = await generateQuestions(
                        title,
                        description,
                        allQuestionsData
                    );

                    console.log('AI Questions generated:', aiQuestions);

                    // Save AI questions to database
                    const aiQuestionIds = [];

                    for (const aiQuestion of aiQuestions) {
                        const counter = await Counter.findOneAndUpdate(
                            { collectionName: Question.modelName },
                            { $inc: { count: 1 } },
                            { new: true, upsert: true }
                        );

                        const newAiQuestion = new Question({
                            questionKey: counter.count,
                            questionText: aiQuestion.text,
                            questionType: aiQuestion.type || 'TEXT',
                            surveyId: newSurvey._id,
                            isAiGenerated: true
                        });

                        await newAiQuestion.save();
                        aiQuestionIds.push(newAiQuestion._id);

                        console.log('AI Question saved:', newAiQuestion._id);
                    }

                    // Link AI questions to survey
                    await Survey.findByIdAndUpdate(
                        newSurvey._id,
                        { $push: { aiGeneratedQuestions: { $each: aiQuestionIds } } }
                    );

                    console.log('AI questions linked to survey');

                } catch (error) {
                    console.error("Error generating AI questions:", error.message);

                }
            }

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
    },


    async getAllCompanies(Company) {
        try {
            const companies = await Company.find({}, { password: 0, createdAt: 0, updatedAt: 0 });
            return {
                statusCode: 200,
                success: true,
                message: "Companies fetched succesfully",
                data: companies
            };
        }
        catch (err) {
            console.error("Error in fetching companies:-", err);
            return {
                statusCode: 500,
                success: false,
                message: "Companies fetched unsuccesful",
                error: {
                    details: err
                }
            };
        }
    },


    async getCompanyById(Company, id) {
        try {
            const company = await Company.findById(id, { password: 0, createdAt: 0, updatedAt: 0 });
            return {
                statusCode: 200,
                success: true,
                message: "Company fetched succesfully",
                data: company
            };
        }
        catch (err) {
            console.error("Error in fetching company:-", err);
            return {
                statusCode: 500,
                success: false,
                message: "Company fetched unsuccesful",
                error: {
                    details: err
                }
            };
        }
    },


    async getCompanySurveys(Survey, companyId) {
        try {
            const surveys = await Survey.find({ companyId: companyId, isActive: true }, { password: 0, updatedAt: 0 });

            // const surveys = await Survey

            // db.surveys.aggregate([
            //     {
            //         $match: {
            //             companyId: ObjectId('69ca03caa925e4cad51a36d6'),
            //             isActive: true
            //         }
            //     },
            //     {
            //         $lookup: {
            //             from: "transactions",
            //             let: { surveyId: "$_id" },
            //             pipeline: [
            //                 {
            //                     $match: {
            //                         $expr: {
            //                             $and: [
            //                                 { $eq: ["$surveyId", "$$surveyId"] },
            //                                 { $eq: ["$userId", ObjectId("69ca0b55a5133a5aee6045db")] }
            //                             ]
            //                         }
            //                     }
            //                 }
            //             ],
            //             as: "transactionInfo"
            //         }
            //     },
            //     {
            //         $match: {
            //             transactionInfo: { $size: 0 } 
            //         }
            //     },
            //     {
            //         $project: {
            //             _id: 1,
            //             surveyName: 1,
            //             description: 1,
            //             isActive: 1,
            //             createdAt: 1
            //         }
            //     }
            // ]);

            return {
                statusCode: 200,
                success: true,
                message: "Surveys fetched succesfully",
                data: surveys
            };
        }
        catch (err) {
            console.error("Error in fetching surveys:-", err);
            return {
                statusCode: 500,
                success: false,
                message: "Surveys fetched unsuccesful",
                error: {
                    details: err
                }
            };
        }
    },

    async getSurveyIntro(Survey, surveyId) {
        try {

            const survey = await Survey.findById(surveyId)
                .populate('companyId', 'companyName')
                .select('-password -createdAt -updatedAt -questions -aiGeneratedQuestions');


            console.log('Survey info:', survey);

            if (!survey) {
                return { statusCode: 404, success: false, message: "Survey not found" };
            }
            return {
                statusCode: 200,
                success: true,
                message: "Survey Intro fetched successfully",
                data: survey
            };
        }
        catch (err) {
            console.error("Error in fetching survey intro:-", err);
            return {
                statusCode: 500,
                success: false,
                message: "Failed to fetch survey intro",
                error: { details: err }
            };
        }
    },

    async startSurveyTransaction(Survey, Transaction, surveyId, userId) {
        try {
            const uuidv4 = require('uuid').v4;
            const transactionId = uuidv4();

            const newTransaction = new Transaction({
                transactionId: transactionId,
                surveyId: surveyId,
                userId: userId,
                answers: []
            });

            await newTransaction.save();

            const survey = await Survey.findById(surveyId)
                .populate('questions', 'questionText questionType options isAiGenerated _id')
                .populate('aiGeneratedQuestions', 'questionText questionType options isAiGenerated _id')
                .lean();

            if (!survey) {
                return { statusCode: 404, success: false, message: "Survey not found" };
            }

            let allQuestions = [];

            if (survey.aiGeneratedQuestions) {
                allQuestions.push(...survey.aiGeneratedQuestions);
            }

            if (survey.questions) {
                allQuestions.push(...survey.questions);
            }

            // TODO: randomize all the question and return it

            return {
                statusCode: 201,
                success: true,
                message: "Transaction generated successfully.",
                data: {
                    transactionId: transactionId,
                    questions: allQuestions,
                    surveyName: survey.surveyName
                }
            };
        } catch (err) {
            console.error("Error generating survey Transaction:", err);
            return {
                statusCode: 500,
                success: false,
                message: "Server Error starting survey",
                error: { details: err }
            };
        }
    },

    async submitResponse(transactionId, data, Transaction) {
        try {

            console.log('inner commanDb call of submitResponse')
            const getTransactionData = await Transaction.find({ transactionId: transactionId });

            console.log('get the data of transaction', getTransactionData);

            if (!getTransactionData) {
                return {
                    statusCode: 404,
                    success: false,
                    message: 'Incorrect transactionId',
                    error: {
                        details: 'Transaction id not found in the database'
                    }
                }
            }

            const insertAllResponse = await Transaction.findOneAndUpdate(
                { transactionId: transactionId },
                { $set: { answers: data } },
                { new: true }
            )

            console.log('insertAllResponse'.insertAllResponse);

            return {
                statusCode: 200,
                success: true,
                message: 'Your response is sent.',
                data: transactionId
            }


        }
        catch (err) {
            console.log('Error in submit the response');
            return {
                statusCode: 500,
                success: false,
                message: 'Server Error while submit the Response',
                error: {
                    details: err
                }
            };
        }
    }
}


module.exports = comman;