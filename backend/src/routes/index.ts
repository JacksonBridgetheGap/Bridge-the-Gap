import express from "express";
import { authRouter } from "./auth";
import { groupsRouter } from "./groups";
import { usersRouter } from "./users";
import { postsRouter } from "./posts";
import { promptRouter } from "./prompt";
import { userEventsRouter } from "./userEvents";
import { groupEventsRouter } from "./groupEvents";
import { graphqlRouter } from "./graphql";

export const routes = express.Router();

routes.use(authRouter);
routes.use(promptRouter);
routes.use(userEventsRouter);
routes.use(groupEventsRouter);
routes.use(groupsRouter);
routes.use(usersRouter);
routes.use(postsRouter);
routes.use(graphqlRouter);
