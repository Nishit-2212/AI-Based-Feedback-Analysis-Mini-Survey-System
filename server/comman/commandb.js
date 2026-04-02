const Counter = require("../models/counter");
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtil');


const comman = {

    async findOneDB(model, query, projection = {}) {
        console.log('Projection data',projection);
        return await model.findOne(query, projection);
    },


    async findByIdDB(model, id, projection = {}) {
        return await model.findById(id, projection);
    },


    async findDB(model, query, projection = {}) {
        return await model.find(query, projection);
    },


    async findByIdAndDeleteDB(model, id) {
        return await model.findByIdAndDelete(id);
    },

    async findOneAndUpdateDB(model, query, update, options = {}) {
        return await model.findOneAndUpdate(query, update, options);
    },


    async aggregateDB(model, pipeline) {
        console.log('pipeline',pipeline);
        return await model.aggregate(pipeline);
    },


    async getUserByEmail(model, email) {
        return await model.findOne({ email });
    },


    async getNextSequence(collectionName) {
        const counter = await Counter.findOneAndUpdate(
            { collectionName: collectionName },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        console.log('Counter',counter)
        return counter.count;
    },


}


module.exports = comman;