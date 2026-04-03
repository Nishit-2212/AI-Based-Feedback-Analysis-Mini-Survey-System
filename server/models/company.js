const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js');
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtil');

const companySchema = new mongoose.Schema({
    companyId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'company'
    },
    state: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Company = mongoose.model("company", companySchema);

Company.signUp = async (data) => {
    try {
        const emailExists = await commanDb.getUserByEmail(Company, data.email);
        if (emailExists) {
            return {
                statusCode: 400,
                success: false,
                message: "Email already exist please login",
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const nextId = await commanDb.getNextSequence(Company.modelName);

        const newCompany = new Company({
            ...data,
            password: hashedPassword,
            companyId: nextId
        });

        await newCompany.save();

        return {
            statusCode: 201,
            success: true,
            message: "signUp succesfully",
            data: newCompany
        };
    } catch (err) {
        console.error("Error in Company signUp:-", err);
        return {
            statusCode: 500,
            success: false,
            message: "SignedUp unsuccesful",
            error: {
                details: err
            }
        };
    }
}

Company.login = async (data) => {
    try {
        const getCompanyData = await commanDb.getUserByEmail(Company, data.email);

        if (!getCompanyData) {
            return {
                statusCode: 404,
                success: false,
                message: "Email is not found"
            };
        }

        let { password } = data;
        let storedPassword = getCompanyData.password;
        const passwordMatched = await bcrypt.compare(password, storedPassword);

        if (!passwordMatched) {
            return {
                statusCode: 401,
                success: false,
                message: "password is incorrect"
            };
        }

        const token = generateAccessToken(getCompanyData, Company.modelName);
        const RefreshToken = generateRefreshToken(getCompanyData._id, getCompanyData.role);

        console.log("getCompanyDetail",getCompanyData);

        return {
            statusCode: 200,
            success: true,
            message: "Login sucessful",
            data: {
                companyName: getCompanyData.companyName,
                name: getCompanyData.name,
                role: 'company' // hard coded this but it will not affect in coding bcz i added role='admin' in the token'
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
}

Company.getAllCompanies = async () => {
    try {
        const companies = await commanDb.findDB(Company, {}, { password: 0, createdAt: 0, updatedAt: 0 });

        return {
            statusCode: 200,
            success: true,
            message: "Companies fetched succesfully",
            data: companies
        };
    } catch (err) {
        console.error("Error in fetching companies:-", err);

        return {
            statusCode: 500,
            success: false,
            message: "Companies fetched unsuccesful",
            error:
            {
                details: err
            }
        };
    }
}

Company.getCompanyById = async (id) => {
    try {
        const company = await commanDb.findByIdDB(Company, id, { password: 0, createdAt: 0, updatedAt: 0 });
        return {
            statusCode: 200,
            success: true,
            message: "Company fetched succesfully",
            data: company
        };
    } catch (err) {
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
}

module.exports = Company;