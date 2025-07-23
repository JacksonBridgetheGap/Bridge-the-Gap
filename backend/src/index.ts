import express from "express";
import session from "express-session";
import { routes } from "./routes";
import cors from "cors";
import morgan from "morgan";

const app: express.Application = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.set("trust proxy", 1); // works alongside "secure" cookie setting
app.use(morgan("tiny"));
app.use(
  session({
    name: "sessionId",
    secret: process.env.AUTH_SECRET || "secret",
    cookie: {
      maxAge: 1000 * 60 * 5,
      secure: false,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  }),
);
app.use("/", routes);

const port: number = Number(process.env.PORT) || 3000;

//**RUN SERVER ON PORT**//
app.listen(port, "0.0.0.0", (): void => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
