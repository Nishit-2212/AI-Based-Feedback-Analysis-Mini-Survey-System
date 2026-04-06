const Transaction = require('../models/transaction.js');
const Survey = require('../models/survey.js');


const submitResponse = async (req, res) => {


    try {

        const { transactionId } = req.params;
        console.log('answeredQuestion', req.body);
        console.log('transactionId', transactionId);
        console.log('userData', req.user);

        const result = await Transaction.submitResponse(transactionId, req.body);
        console.log('result', result)

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        })

    }
    catch (err) {

        console.error('something goes wrong while submit the survey..')
        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong while submit the survey',
            error: {
                details: err
            }
        };

    }



}


const totalTransaction = async (req, res) => {

    try {

        const companyId = req.user.id;
        console.log('compamyId is ', companyId);
        const transaction = await Survey.getAllSurveyTransactionByCompanyId(companyId);

        console.log('Total responses that company get', transaction.data.length)

        return res.status(transaction.statusCode).json({
            success: transaction.success,
            message: transaction.message,
            data: transaction.data || null,
            error: transaction.error || null
        })

    }
    catch (err) {
        console.error('Something goes wrong while getting total Response companyWise')

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong while submit the survey',
            error: {
                details: err
            }
        };

    }

}


const getAllResponseBySurveyId = async (req, res) => {

    try {

        const { surveyId } = req.params;

        const response = await Transaction.getAllResponseBySurveyId(surveyId);

        console.log('all responses', response);

        return res.status(response.statusCode).json({
            success: response.success,
            message: response.message,
            data: response.data || null,
            error: response.error || null
        })


    }
    catch (err) {
        console.log('error in getting survey response by surveyId')

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong while fetching all survey',
            error: {
                details: err
            }
        };

    }

}


module.exports = { submitResponse, totalTransaction, getAllResponseBySurveyId }