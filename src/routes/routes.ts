import express, { Express, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import barriosRoutes from './barrios';
import placesRoutes from './places';
import eventsRoutes from './events';
// import plannerRoutes from './planner';

function routes(app: Express) {

  app.get("/healthcheck", (req: Request, res: Response) => { res.sendStatus(StatusCodes.OK);});
  
  // app.use('/api/another', anotherRoutes);
  
  app.use('/api/barrios', barriosRoutes);
  
  app.use('/api/explore', placesRoutes);


  app.use('/api/events', eventsRoutes);
  // app.use('/api/planner', plannerRoutes);

}

export default routes;
