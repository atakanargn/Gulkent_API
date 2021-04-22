const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema({
    customer_id: {
        type: String,
        required: true
    },
    tc_no:{
        type:String,
        required:true
    },
    first_name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    fee:{
        type:Number,
        required:true
    },
    prevBudget:{
        type:Number,
        required:true
    },
    lastBudget:{
        type:Number,
        required:true
    },
    deviceId:{
        type:String,
        required:true
    },
    line:{
        type:String,
        required:true
    },
    station:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('transportReport', budgetSchema)