const mongoose = require('mongoose');

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
    companyEmail: {
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
    password: {
        type: String,
        required: true
    }
}, { timestamps: true})

module.exports = mongoose.model("company",companySchema);