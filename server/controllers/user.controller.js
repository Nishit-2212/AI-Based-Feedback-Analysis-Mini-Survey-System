const Company = require('../models/company');
const Survey = require('../models/survey');

const getAllCompanies = async (req, res) => {
    try {
        console.log("Fetching all companies...");
        
        const result = await Company.getAllCompanies();

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data || null,
            error: result.error || null
        });
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ success: false, message: "Internal server error connecting to DB" });
    }
};

const getCompanySurveys = async (req, res) => {
    try {
        const { companyId } = req.params;
        console.log(`Company Id isa ${companyId}`);

        const company = await Company.getCompanyById(companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        const surveys = await Survey.getCompanySurveys(companyId);

        return res.status(surveys.statusCode).json({
            success: surveys.success,
            message: surveys.message,
            data: surveys.data || null,
            error: surveys.error || null
        });
    } catch (error) {
        console.error("Error fetching company surveys:", error);
        res.status(500).json({ success: false, message: "Internal server error connecting to DB" });
    }
};


module.exports = { getAllCompanies, getCompanySurveys}
