const Joi = require('joi')

const validators = {

    registerValidator: Joi.object({
        rfid: Joi.string().min(1).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(1).required(),
        confirm_password: Joi.string().min(1).required(),
        name: Joi.string().min(1).required(),
        contact: Joi.number().min(1).required(),
    })
    
}

module.exports = validators


