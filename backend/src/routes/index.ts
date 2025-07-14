import express from "express";
import { authRouter } from "./auth";
import { promptRouter } from "./prompt";
import { eventsRouter } from "./events";

export const routes = express.Router();

routes.use(authRouter);
routes.use(promptRouter);
routes.use(eventsRouter);
