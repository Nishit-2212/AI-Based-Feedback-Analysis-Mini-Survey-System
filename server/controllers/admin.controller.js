const Question = require('../models/question.js')
const User = require("../models/user.js")

const addCommanQustion = async (req, res) => {

    try {
        console.log("Inner addCOmmanQuestion controller");
        const { id } = req.user;
        const result = await Question.createQuestion(id, req.body);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })
    }

}

const getAllUser = async (req, res) => {

    try {

        const allUser = await User.getAllUser();

        return res.status(allUser.statusCode).json({
            success: allUser.success,
            message: allUser.message,
            data: allUser.data || null,
            error: allUser.error || null
        })

    }
    catch (err) {

        console.error('error', err)

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: { details: err }
        })

    }

}

const getAllCommanQuestions = async (req, res) => {

    try {

        const result = await Question.getAllCommanQuestions();

        console.log("Result in controller", result);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        });

    }
    catch (err) {
        console.log('erro while getAllCommanQuestion', err);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: { details: err }
        });
    }

}

module.exports = { addCommanQustion, getAllUser, getAllCommanQuestions }