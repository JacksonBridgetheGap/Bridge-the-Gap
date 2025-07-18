import express from "express";
import session from "express-session";
import { routes } from "./routes";
import cors from "cors";
import morgan from "morgan";

const app: express.Application = express();
app.use(express.json());

app.use(cors());
app.set("trust proxy", 1); // works alongside "secure" cookie setting
app.use(morgan("tiny"));
app.use(
  session({
    name: "sessionId",
    secret: process.env.AUTH_SECRET || "secret",
    cookie: {
      maxAge: 1000 * 60 * 5,
      secure: process.env.RENDER ? true : false,
      httpOnly: false,
    },
    resave: false,
    saveUninitialized: false,
  }),
);
app.use("/", routes);

const port: number = 3000;

//**RUN SERVER ON PORT**//
app.listen(port, (): void => {
  console.log(`Server listening at http://localhost:${port}`);
});
