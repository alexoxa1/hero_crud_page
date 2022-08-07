const mongoose = require('mongoose');
const heroSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    real_name: {
        type: String,
        required: true
    },
    origin_description: {
        type: String,
        required: true
    },
    superpowers: {
        type: String,
        required: true
    },
    catch_phrase: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
});
module.exports = mongoose.model('Hero', heroSchema);