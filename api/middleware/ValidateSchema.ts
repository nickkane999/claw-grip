import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import Logging from "../library/Logging";
import { Script } from "../models/Script";
import { User } from "../models/User";

export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      Logging.error(err);
      res.status(422).json({ error: err });
    }
  };
};

export const Schemas = {
  script: {
    create: Joi.object<Script>({
      name: Joi.string().required(),
    }),
    update: Joi.object<Script>({
      name: Joi.string().required(),
    }),
  },
  user: {
    create: Joi.object<User>({
      username: Joi.string().required(),
    }),
    update: Joi.object<User>({
      username: Joi.string().required(),
    }),
  },
};
