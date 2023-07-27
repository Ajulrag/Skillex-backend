const Joi = require('joi');

const schema = {
    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    }).messages({
        'any.required': 'Email and Password are required',
    }),

    signupSchema: Joi.object({
        name: Joi.string().trim().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).required(),
    }).messages({
        'any.required': 'Name, Email, and Password are required',
    }),
};

module.exports = schema;
