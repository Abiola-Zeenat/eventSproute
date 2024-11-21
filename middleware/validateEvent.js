import Joi from "joi";

export const createEventSchema = Joi.object().keys({
  title: Joi.string().min(3).required().messages({
    "string.base": "title should be a string",
    "string.min": "title should have a minimum length of 3",
    "any.required": "title is a required field",
  }),
  description: Joi.string().min(10),
  date: Joi.date().greater("now").example("mm/dd/yyyy").required(),
  createdBy: Joi.string()
    .hex()
    .length(24)
    .message("createdby should be a valid objectId"),
});

export const updateEventSchema = Joi.object().keys({
  title: Joi.string().min(3).messages({
    "string.base": "title should be a string",
    "string.min": "title should have a minimum length of 3",
  }),
  description: Joi.string().min(10),
  date: Joi.date().greater("now").example("mm/dd/yyyy"),
  createdBy: Joi.string()
    .hex()
    .length(24)
    .message("createdby should be a valid objectId"),
});
