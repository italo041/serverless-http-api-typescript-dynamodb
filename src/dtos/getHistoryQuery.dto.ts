import Joi = require("joi");

export interface GetHistoryQueryDTO {
  limit?: number;
  lastEvaluatedKey?: {
    id: string;
    createdAt: number;
    type: string;
  };
  order?: "asc" | "desc";
}

export const getHistoryQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  lastEvaluatedKey: Joi.object({
    id: Joi.string().required(),
    createdAt: Joi.number().required(),
    type: Joi.string().required(),
  }).optional(),
  order: Joi.string().valid("asc", "desc").optional().default("desc"),
});
