import Joi from "joi";

export const validateSignup = (user) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(3).required().messages({
      "string.base": "name should be a string",
      "string.min": "name should have a minimum length of 3",
      "any.required": "name is a required field",
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    role: Joi.string().valid("user", "admin", "organizer").default("user"),
  });
  return schema.validate(user);
};

export const validateLogin = (user) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  return schema.validate(user);
};

export const validateUpdateRole = (role) => {
  const schema = Joi.object().keys({
    role: Joi.string().valid("user", "admin", "organizer").required(),
  });
return schema.validate(role);
} 
