const mongoose = require('mongoose');
const commanDb = require('../comman/commandb');
const { v4: uuidv4 } = require('uuid');
const { generateQuestions } = require('../utils/openaiUtil');

const surveySchema = new mongoose.Schema({
    surveyId: {
        type: Number
    },
    surveyName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    textAnalyzer: {
        type: Boolean,
        default: false
    },
    textAnalyzerKeyword: {
        type: String,
        default: ""
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'question'
        }
    ],
    aiGeneratedQuestions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'question'
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    surveyLink: {
        type: String
    }
}, { timestamps: true })



const Survey = mongoose.model("survey", surveySchema);


Survey.createSurvey = async (data, companyId, Question) => {
    try {
        console.log('inner create survey data', data);
        const { title, description, textAnalyzer, textAnalyzerKeyword } = data;

        const nextId = await commanDb.getNextSequence(Survey.modelName);
        const surveyIdLink = uuidv4();

        const newSurvey = new Survey({
            surveyName: title,
            description: description,
            companyId: companyId,
            surveyId: nextId,
            surveyLink: surveyIdLink,
            textAnalyzer: textAnalyzer,
            textAnalyzerKeyword: textAnalyzerKeyword || ""
        })

        await newSurvey.save();

        const questionIds = [];
        const allQuestionsData = [];

        for (const question of data.questions) {
            const questionDynamicKey = `dynamic_key_${companyId}_${uuidv4()}`;

            if (question.type === 'TEXT') {
                const newQuestion = new Question({
                    questionKey: questionDynamicKey,
                    questionText: question.text,
                    questionType: question.type,
                    surveyId: newSurvey._id,
                    companyId: companyId,
                    isAiGenerated: false
                });

                allQuestionsData.push({ text: question.text, type: question.type });
                questionIds.push(newQuestion._id);

                await newQuestion.save();
            } else {
                const options = [];
                for (const option of question.options) {
                    options.push(option.value);
                }

                const newQuestion = new Question({
                    questionKey: questionDynamicKey,
                    questionText: question.text,
                    questionType: question.type,
                    surveyId: newSurvey._id,
                    companyId: companyId,
                    isAiGenerated: false,
                    options: options
                });

                allQuestionsData.push({ text: question.text, type: question.type });
                questionIds.push(newQuestion._id);

                await newQuestion.save();
            }
        }

        await commanDb.findOneAndUpdateDB(Survey, { _id: newSurvey._id }, { $push: { questions: { $each: questionIds } } }, { new: true });

        if (textAnalyzer) {
            try {

                console.log('TextAnalyzer is on. and generating AI questions.');

                console.log('all question data', allQuestionsData);

                const aiQuestions = await generateQuestions(title, description, allQuestionsData, textAnalyzerKeyword);
                console.log('AI Questions generated:', aiQuestions);

                // const aiQuestionIds = [];
                // for (const aiQuestion of aiQuestions) {
                //     const questionDynamicKey = `dynamic_key_${companyId}_${uuidv4()}`;

                //     const newAiQuestion = new Question({
                //         questionKey: questionDynamicKey,
                //         questionText: aiQuestion,
                //         questionType: aiQuestion.type || 'TEXT',
                //         surveyId: newSurvey._id,
                //         companyId: companyId,
                //         isAiGenerated: true
                //     });

                //     await newAiQuestion.save();
                //     aiQuestionIds.push(newAiQuestion._id);
                //     console.log('AI Question saved with Key:', newAiQuestion.questionKey);
                // }

                const questionDynamicKey = `dynamic_key_${companyId}_${uuidv4()}`;

                const aiQuestionIds = [];
                const newAiQuestion = new Question({
                    questionKey: questionDynamicKey,
                    questionText: aiQuestions,
                    questionType: 'TEXT',
                    surveyId: newSurvey._id,
                    companyId: companyId,
                    isAiGenerated: true
                });

                await newAiQuestion.save();
                aiQuestionIds.push(newAiQuestion._id);

                console.log('new AI question is generated:-', newAiQuestion)

                await commanDb.findOneAndUpdateDB(Survey, { _id: newSurvey._id }, { $push: { aiGeneratedQuestions: { $each: aiQuestionIds } } }, { new: true });
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
}

Survey.getPendingCompanySurvey = async (companyId, userId) => {
    try {
        const surveys = await commanDb.aggregateDB(Survey, [
            { $match: { companyId: new mongoose.Types.ObjectId(companyId), isActive: true } },
            {
                $lookup: {
                    from: "transactions",
                    let: { surveyId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $and: [{ $eq: ["$surveyId", "$$surveyId"] }, { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] }] } } }
                    ],
                    as: "transactionInfo"
                }
            },
            { $match: { transactionInfo: { $size: 0 } } },
            { $project: { transactionInfo: 0, updatedAt: 0, password: 0 } }
        ]);

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
}

Survey.getSurveyIntro = async (surveyId) => {
    try {
        const survey = await Survey.findById(surveyId)
            .populate('companyId', 'companyName')
            .select('-password -createdAt -updatedAt -questions -aiGeneratedQuestions');

        console.log('Survey info:', survey);
        if (!survey) {
            return {
                statusCode: 404,
                success: false,
                message: "Survey not found"
            };
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
            error: {
                details: err
            }
        };
    }
}

Survey.getAllCompanySurveys = async (companyId) => {
    try {
        const surveys = await Survey.aggregate([
            { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
            {
                $lookup: {
                    from: "transactions",
                    localField: "_id",
                    foreignField: "surveyId",
                    as: "responses"
                }
            },
            {
                $addFields: {
                    totalResponsesCount: { $size: "$responses" }
                }
            },
            { $project: { responses: 0, password: 0 } },
            { $sort: { updatedAt: -1 } }
        ]);

        return {
            statusCode: 200,
            success: true,
            message: "All Surveys fetched succesfully",
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
}

Survey.getCompanySurveyById = async (companyId, surveyId) => {
    try {
        const survey = await Survey.findOne({
            companyId: new mongoose.Types.ObjectId(companyId),
            _id: new mongoose.Types.ObjectId(surveyId)
        })
            .populate('questions')
            .populate('aiGeneratedQuestions');

        if (!survey) {
            return {
                statusCode: 404,
                success: false,
                message: "Survey not found",
                error: {
                    details: "Survey not found with given ID"
                }
            };
        }

        console.log('get Survey by company ', survey);

        // Converting thisinto javascript object so that i can modify it and save it to in the array
        const finalSurveyData = survey.toObject();

        let allQuestionsCombined = [];

        if (survey.questions) {
            allQuestionsCombined = allQuestionsCombined.concat(survey.questions);
        }

        if (survey.aiGeneratedQuestions) {
            allQuestionsCombined = allQuestionsCombined.concat(survey.aiGeneratedQuestions);
        }

        finalSurveyData.questions = allQuestionsCombined;

        return {
            statusCode: 200,
            success: true,
            message: "Your survey fetched successfully",
            data: finalSurveyData
        };

    } catch (err) {
        console.error("Error in fetching surveys:", err);
        return {
            statusCode: 500,
            success: false,
            message: "Survey not found",
            error: {
                details: err
            }
        };
    }
};

// this is for middleware
Survey.checkCompanySurveyExist = async (companyId, surveyId) => {
    try {
        const survey = await commanDb.findOneDB(Survey, { _id: new mongoose.Types.ObjectId(surveyId), companyId: new mongoose.Types.ObjectId(companyId) });

        return {
            statusCode: 200,
            success: true,
            message: "Surveys fetched succesfully",
            data: survey
        };

    }
    catch (err) {
        console.error("Error in fetching company specific surveys:-", err);
        return {
            statusCode: 500,
            success: false,
            message: "Surveys fetched unsuccesful",
            error: {
                details: err
            }
        };
    }
}


Survey.deleteCompanySurveyById = async (surveyId) => {
    try {
        const surveyDelete = await commanDb.findByIdAndDeleteDB(Survey, surveyId);

        if (!surveyDelete) {
            return {
                statusCode: 404,
                success: false,
                message: "Survey not found"
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: "Survey deleted successfully"
        };

    }
    catch (err) {
        console.error("Error in deleting company specific surveys:-", err);
        return {
            statusCode: 500,
            success: false,
            message: "Surveys deleted Unsuccesful",
            error: {
                details: err
            }
        };
    }
}


Survey.toggleSurveyStatus = async (surveyId) => {
    try {
        const survey = await commanDb.findByIdDB(Survey, surveyId);

        if (!survey) {
            return {
                statusCode: 404,
                success: false,
                message: "Survey not found"
            }
        };

        const updatedSurvey = await commanDb.findOneAndUpdateDB(
            Survey,
            { _id: new mongoose.Types.ObjectId(surveyId) },
            { $set: { isActive: !survey.isActive } },
            { new: true }
        );

        return {
            statusCode: 200,
            success: true,
            message: "Status updated successfully",
            data: updatedSurvey
        };
    } catch (err) {
        console.error("Error in updating status:-", err);
        return {
            statusCode: 500,
            success: false,
            message: "Failed to update status",
            error: {
                details: err
            }
        };
    }
}


Survey.getAllSurveyTransactionByCompanyId = async (companyId) => {

    try {

        const aggregation = [
            {
                $match: {
                    companyId: new mongoose.Types.ObjectId(companyId)
                }
            },
            {
                $lookup: {
                    from: 'transactions',
                    foreignField: 'surveyId',
                    localField: '_id',
                    as: 'transactionInfo'
                }
            },
            {
                $unwind: '$transactionInfo'
            }
        ]

        const survey = await commanDb.aggregateDB(Survey, aggregation)

        console.log('TOtal transactions with survey info', survey);

        return {
            statusCode: 200,
            success: true,
            message: 'fetched all given survey',
            data: survey
        }


    }
    catch (err) {

        console.error('something went wrong while getting all survey transaction by companyId')
        return {
            statusCode: 500,
            success: false,
            message: 'Something went wron during fetching survey of given survey',
            error: {
                details: err
            }
        }
    }

}



// Survey.getAllSurveyByUserId = async (surveyId) => {

//     try {






//     }
//     catch (err) {
//         console.error("Error in fetching company specific surveys:-", err);
//         return {
//             statusCode: 500,
//             success: false,
//             message: "Surveys fetched unsuccesful",
//             error: {
//                 details: err
//             }
//         };
//     }

// }

module.exports = Survey;