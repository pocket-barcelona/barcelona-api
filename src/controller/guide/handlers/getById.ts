import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { GuidesService } from "../../../service/guides/guides.service";

/**
 * Get a guides
 * @param req
 * @param res
 * @returns
 */
export default async function getById(req: Request, res: Response) {
  
  // const data = await GuidesService.getById();
  const content = `
  <div>
  <h1>This is a h1 title</h1>
  <p>This is a blog post here</p>
  <h2>This is a h2 title</h2>
  <p>Content here</p>
  <h3>This is a h3 title</h3>
  <p>Content here</p>
  </div>`;
  const data = {
    content,
    title: 'My blog title',
    description: 'My teaser guide description here',
    published: new Date().toISOString(),
  }
  if (!data) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(data));
}
