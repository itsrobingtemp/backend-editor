// Validation
const Joi = require("@hapi/joi");

// Register
const userValidation = (user) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
};

module.exports.userValidation = userValidation;
