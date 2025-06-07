import Joi = require('joi');

export interface OrderDTO {
  name: string;
  price: number;
  type: string;
}

export const createOrderSchema = Joi.object<OrderDTO>({
  name: Joi.string().required(),
  price: Joi.number().required(),
  type: Joi.string().required(),
}).min(1);