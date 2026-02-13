import * as Joi from 'joi';

enum Environment {
  Development = 'development',
  Production = 'production',
}

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.Development),
  PORT: Joi.number().default(4000),
  DATABASE_URL: Joi.string().required(),
  HASH_SALT: Joi.number().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_SECRET_KEY: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  JWT_RESET_SECRET_KEY: Joi.string().required(),
  JWT_RESET_EXPIRES_IN: Joi.string().required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  EMAIL_SENDER: Joi.string().required(),
  BACKOFFICE_RESET_PASSWORD_URL: Joi.string().required(),
  BACKOFFICE_BASE_URL: Joi.string().required(),
  APP_URL: Joi.string().required(),
});
