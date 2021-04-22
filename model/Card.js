const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique:true
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model('Card', cardSchema)