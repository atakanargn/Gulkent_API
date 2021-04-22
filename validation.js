// Validation
const Joi = require('@hapi/joi');

// Register Validation
const CustomerValidation = (data) => {
    const schema = {
        tc_no: Joi.string().min(11).max(11).required(),
        first_name: Joi.string().min(3).required(),
        surname: Joi.string().min(2).required(),
        phone: Joi.string().min(11).max(11).required(),
        email: Joi.string().min(8).email(),
        birthDate: Joi.string().min(10).required(),
        discountDocument:Joi.string(),
        card_type:Joi.string().required(),
        card_uid:Joi.string().required(),
        budget:Joi.number().required(),
        card_visa:Joi.date(),
        hes_code:Joi.string()
    }
    return Joi.validate(data, schema);
}

module.exports.CustomerValidation = CustomerValidation