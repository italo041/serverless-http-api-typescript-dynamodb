import Joi = require('joi');

export interface LoginDTO {
  username: string;
  password: string;
}

export const loginSchema = Joi.object<LoginDTO>({
  username: Joi.string().required(),
  password: Joi.string().required(),
});