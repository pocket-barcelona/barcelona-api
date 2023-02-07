import express, { Express, Request, Response } from "express";
import { BarriosController } from "../controller/barrios/barrios.controller";
const router = express.Router()


// ########### BARRIOS ###########
router.get("/regions", [], BarriosController.getRegionsListHandler);

router.get("/locales", [], BarriosController.getListHandler);

export default router;
