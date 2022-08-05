const Joi = require('joi')

const validators = {

    registerValidator: Joi.object({
        serial: Joi.string().length(6).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
        confirm_password: Joi.string().min(4).required(),
        name: Joi.string().min(3).required(),
        contact: Joi.number().min(3).required(),
    })
    
}

module.exports = validators


