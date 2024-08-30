import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";

/**
 * Sync all calendar events from CSV to AWS Dynamo DB
 */
export default async function syncEventsDynamo(req: Request, res: Response) {
  return res.send(success('OK'));
}
