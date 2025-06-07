import Joi = require("joi");

export interface GetHistoryQueryDTO {
  limit?: number;
  lastKey?: string;
}

export const getHistoryQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  lastKey: Joi.string().optional(), 
});
