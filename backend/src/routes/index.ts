import express from "express";
import { authRouter } from "./auth";
import { promptRouter } from "./prompt";
import { userEventsRouter } from "./userEvents";
import { groupEventsRouter } from "./groupEvents";

export const routes = express.Router();

routes.use(authRouter);
routes.use(promptRouter);
routes.use(userEventsRouter);
routes.use(groupEventsRouter);
