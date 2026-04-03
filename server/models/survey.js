const mongoose = require('mongoose');
const commanDb = require('../comman/commandb');
const { v4: uuidv4 } = require('uuid');

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
    questions: [
        {
            type: String,
            ref: 'question'
        }
    ],
    aiGeneratedQuestions: [
        {
            type: String,
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
        const { title, description, textAnalyzer } = data;

        const nextId = await commanDb.getNextSequence(Survey.modelName);
        const surveyIdLink = uuidv4();

        const newSurvey = new Survey({
            surveyName: title,
            description: description,
            companyId: companyId,
            surveyId: nextId,
            surveyLink: surveyIdLink,
            textAnalyzer: textAnalyzer
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
                questionIds.push(newQuestion.questionKey);

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
                questionIds.push(newQuestion.questionKey);

                await newQuestion.save();
            }
        }

        await commanDb.findOneAndUpdateDB(Survey, { _id: newSurvey._id }, { $push: { questions: { $each: questionIds } } }, { new: true });

        if (textAnalyzer) {
            try {
                const { generateQuestions } = require('../utils/openaiUtil');
                console.log('TextAnalyzer is on. and generating AI questions.');

                const aiQuestions = await generateQuestions(title, description, allQuestionsData);
                console.log('AI Questions generated:', aiQuestions);

                const aiQuestionIds = [];
                for (const aiQuestion of aiQuestions) {
                    const questionDynamicKey = `dynamic_key_${companyId}_${uuidv4()}`;

                    const newAiQuestion = new Question({
                        questionKey: questionDynamicKey,
                        questionText: aiQuestion.text,
                        questionType: aiQuestion.type || 'TEXT',
                        surveyId: newSurvey._id,
                        companyId: companyId,
                        isAiGenerated: true
                    });

                    await newAiQuestion.save();
                    aiQuestionIds.push(newAiQuestion.questionKey);
                    console.log('AI Question saved with Key:', newAiQuestion.questionKey);
                }

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
        const surveys = await commanDb.findDB(Survey, { companyId: companyId }, { password: 0 });
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
        const surveys = await Survey.findOne({ companyId: new mongoose.Types.ObjectId(companyId), _id: new mongoose.Types.ObjectId(surveyId) }).populate('questions');

        if (!surveys) {
            return {
                statusCode: 404,
                success: false,
                message: "Survey not found",
                error: {
                    details: "Survey not found with given ID"
                }
            }
        }

        return {
            statusCode: 200,
            success: true,
            message: "You Surveys fetched succesfully",
            data: surveys
        };

    }
    catch (err) {
        console.error("Error in fetching surveys:-", err);
        return {
            statusCode: 500,
            success: false,
            message: "Survey not found",
            error: {
                details: err
            }
        };
    }
}

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