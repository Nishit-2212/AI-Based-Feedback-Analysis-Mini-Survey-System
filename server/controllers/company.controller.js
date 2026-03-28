
const Question = require('../models/question');
const Survey = require('../models/survey')


const surveyCreate = async (req, res) => {
    try {
        console.log('inner survey Controller');
        const result = await Survey.createSurvey(req.body.survey, Question);

        console.log('req.protocol',req.protocol);
        console.log('req.get("host")',req.get("host"));
        console.log('url',process.env.CLIENT_URL);
        

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



module.exports = { surveyCreate };