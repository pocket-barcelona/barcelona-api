import express, { type Express, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import barriosRoutes from "./barrios";
import placesRoutes from "./places";
import eventsRoutes from "./events";
import meetupRoutes from "./meetup";
import meetupGroupRoutes from "./meetupGroup";
import plannerRoutes from "./planner";
import poiRoutes from "./poi";
import postsRoutes from "./posts";
import adminRoutes from "./admin";
import sessionRoutes from './session';
import usersRoutes from './users';

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(StatusCodes.OK);
  });
  app.use("/api/barrios", barriosRoutes);
  app.use("/api/explore", placesRoutes);
  app.use("/api/poi", poiRoutes);
  app.use("/api/events", eventsRoutes);
  app.use("/api/meetup", meetupRoutes);
  app.use("/api/meetupGroup", meetupGroupRoutes);
  app.use("/api/planner", plannerRoutes);
  app.use("/api/posts", postsRoutes);
  // USER LOGIN/AUTH
  app.use('/api/auth/session', sessionRoutes);
  // USER CREATION, PROFILE, RESET PASSWORD etc
  app.use('/api/user', usersRoutes);
  // CMS ROUTES
  app.use("/api/admin", adminRoutes);
}

export default routes;
