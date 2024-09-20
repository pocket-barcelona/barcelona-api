import type { Request, Response, NextFunction } from "express";
import { type AnyZodObject, ZodError } from "zod";
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
        const path = e.errors[0].path ? e.errors[0].path.join('.') : '';
        const received = e.errors[0].received ?? '';
        const msg = `${e.errors[0].message}${path ? ` in ${path}` : ''}${received ? `. Received ${received}` : ''}`;

        errorMessage = msg || 'Something went wrong!';
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
