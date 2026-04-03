const Transaction = require('../models/transaction');

const isAlreadySubmitted = async (req, res, next) => {

    console.log('inner checkSurveySubmssion middleware');

    try {
        const user = req.user;
        const surveyId = req.params.surveyId;

        if (user.role == 'user') {
            const transactionExists = await Transaction.findOne({ 
                userId: user.id, 
                surveyId: surveyId 
            });

            if (transactionExists) {
                return res.status(403).json({
                    success: false,
                    message: "You have already submitted or started this survey."
                });
            }

            next();
        }
        else {
            next();
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

module.exports = { isAlreadySubmitted };