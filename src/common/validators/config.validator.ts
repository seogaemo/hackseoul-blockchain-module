import Joi from "joi";

export const ConfigValidator = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("production"),
});
