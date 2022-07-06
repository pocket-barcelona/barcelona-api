import express, { Express, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import barriosRoutes from './barrios';
import placesRoutes from './places';

function routes(app: Express) {

  app.get("/healthcheck", (req: Request, res: Response) => { res.sendStatus(StatusCodes.OK);});
  
  // app.use('/api/another', anotherRoutes);
  
  app.use('/api/barrios', barriosRoutes);
  app.use('/api/places', placesRoutes);
}

export default routes;
