import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema, resolvers } from "../graphql/schema";

export const graphqlRouter = express.Router();

graphqlRouter.use(
  "/api/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  }),
);
