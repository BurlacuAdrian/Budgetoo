const Joi = require('joi')

const emailSchema = Joi.string()
  .email()
  .required()
  .messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.'
  });

  const passwordSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`-]*$/) // Allow specific special characters and ensure no white spaces
  .max(20) // Maximum length of 20 characters
  .required() // Password is required
  .messages({
    'string.pattern.base': 'Password must contain only alphanumeric characters and special characters like !? and others, and must not contain any white spaces',
    'string.max': 'Password must be 20 characters or fewer',
    'any.required': 'Password is required',
  });

module.exports = {
  emailSchema,
  passwordSchema,
}