import express, { Express, Request, Response } from "express";
import { BarriosController } from "../controller/barrios/barrios.controller";
// import requireUser from "../middleware/requireUser";
const router = express.Router()


// ########### BARRIOS ###########
router.get("/", [], BarriosController.getListHandler);

export default router;
