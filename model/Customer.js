const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    customer_id: {
        type: String,
        required: true,
        unique:true
    },

    tc_no:{
        type:String,
        required:true,
        unique:true
    },
    first_name:{
        type:String,
        required:true
    },
    surname:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:false
    },
    birthDate:{
        type:Date,
        required:true
    },
    discountDocument:{
        type:String,
        required:false
    },


    card_type:{
        type:String,
        required:true
    },
    card_uid:{
        type:String,
        required:true,
        unique:true
    },
    budget:{
        type:Number,
        required:false,
        default:0.0
    },
    card_visa:{
        type:Date,
        default:"2100-01-01",
        required:false
    },
    last_CardRead:{
        type:Date,
        default:Date.now,
        required:false
    },
    hes_code:{
        type:String,
        required:false
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Customer', customerSchema)