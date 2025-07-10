import express from "express";
import { authRouter } from "./auth";
import { promptRouter } from "./prompt";

export const routes = express.Router();

routes.use(authRouter);
routes.use(promptRouter);
