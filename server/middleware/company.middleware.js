const Survey = require('../models/survey')


const isCompany = (req, res, next) => {

    // console.log('1111',req)
    try {
        const role = req.user.role;
        console.log("role", role);

        if (role !== 'company') {
            return res.status(400).json({
                success: false,
                message: "You are not Login wih Company mail",
                error: {
                    details: "pleas re-login with Company Email"
                }
            });
        }
        next();
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "You are not Login wih Company mail",
            error: {
                details: "Something goes wrong in CompanyMiddleware(isCompany method)"
            }
        });
    }
}

const isSurveyOwner = async (req, res, next) => {

    console.log('inner isSurveyOwner middlware');
    

    try {

        const companyId = req.user.id;
        const { surveyId } = req.params;

        const survey = await Survey.checkCompanySurveyExist(companyId, surveyId)

        if(!survey.data) {
            return res.status(403).json({
            success: false,
            message: "You are not owner of this survey.",
            error: {
                details: "Company accessing other company's survey"
            }
        });
        }

        next();

    }
    catch (err) {
        console.error('Error in isSurveyOwner middleware', err)
        return res.status(500).json({
            success: false,
            message: "You are not owner of this survey.",
            error: {
                details: "Something goes wrong in CompanyMiddleware(isSurveyOwner)"
            }
        });
    }
}


module.exports = { isCompany, isSurveyOwner }