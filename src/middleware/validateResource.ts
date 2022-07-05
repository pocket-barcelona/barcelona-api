import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { error } from "./apiResponse";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      // extract schema validation errors from Zod
      let errorMessage = '';
      let validationErrorCode = '';
      if (e.errors && e.errors.length > 0) {
        errorMessage = e.errors[0].message || 'Something went wrong!';
        validationErrorCode = e.errors[0].code || '';
      }
      return res.status(400).send(
        error(
          errorMessage,
          res.statusCode,
          validationErrorCode || '',
        )
      );
    }
  };

export default validate;
