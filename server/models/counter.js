const mongoose = require('mongoose');
const commanDb = require('../comman/commandb.js')


const counterSchema = new mongoose.Schema({

    collectionName: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        required: true
    }

}, { timestamps: true })


const Counter = mongoose.model("counter",counterSchema);




module.exports = Counter;