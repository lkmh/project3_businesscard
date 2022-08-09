const Joi = require('joi')

const validators = {

    registerValidator: Joi.object({
        rfid: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(1).required(),
        confirm_password: Joi.string().min(1).required(),
        name: Joi.string().min(1).required(),
        contact: Joi.number().min(1).required(),
    }), 
    loginValidator: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(1).required(),
    }),
    updateValidator: Joi.object({
        name: Joi.string().min(1),
        contact: Joi.number().min(1),
        whatsapp: Joi.number().allow('').allow(null),
        telegram:  Joi.string().allow('').allow(null),
        instagram:  Joi.string().allow('').allow(null),
        url:  Joi.string().allow('').allow(null),
    }), 
}

module.exports = validators


