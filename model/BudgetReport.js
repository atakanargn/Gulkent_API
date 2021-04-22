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
    prevBudget:{
        type:Number,
        required:true
    },
    lastBudget:{
        type:Number,
        required:true
    },
    loadBudget:{
        type:Number,
        required:true
    },
    deviceId:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('budgetReport', budgetSchema)