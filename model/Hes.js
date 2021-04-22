const mongoose = require('mongoose');

const hesSchema = mongoose.Schema({
    hes: {
        type: String,
        required: true,
        unique:true
    },
    ad_soyad: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default:0
    }
});

module.exports = mongoose.model('Hes', hesSchema)