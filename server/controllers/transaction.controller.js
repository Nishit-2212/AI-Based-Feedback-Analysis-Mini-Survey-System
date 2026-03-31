const Transaction = require('../models/transaction.js');



const submitResponse = async (req, res) => {


    try {

        const { transactionId } = req.params;
        console.log('answeredQuestion', req.body);
        console.log('transactionId', transactionId);
        console.log('userData', req.user);

        const result = await Transaction.submitResponse(transactionId,req.body);
        console.log('result',result)
    }
    catch (err) {



    }



}


module.exports = { submitResponse }