const mongoose = require('mongoose');

const card_typeSchema = mongoose.Schema({
    card_type: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    fee: {
        type: Number,
        required: false,
        default: 0.0
    },
    transfer_fee: {
        type: Number,
        required: false,
        default: 0.0
    },
    has_visa:{
        type:Boolean,
        required:true,
        default:false
    },
    visa_time:{
        type:Number,
        required:false,
        default:0
    }
});

module.exports = mongoose.model('CardType', card_typeSchema)