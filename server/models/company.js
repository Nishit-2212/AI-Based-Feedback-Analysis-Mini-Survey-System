const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js')

const companySchema = new mongoose.Schema({
    companyId: {
        type: Number,
        // required: true
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
}, { timestamps: true})

const Company = mongoose.model("company",companySchema);

Company.signUp = async(data) => {
    return await commanDb.signUp(Company,data);
}

Company.login = async(data) => {
    return await commanDb.login(Company,data);
}

module.exports = Company;