import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authenticationHeader = req.headers["authorization"];
  const token = authenticationHeader && authenticationHeader.split(" ")[1];

  if (token == null) {
    res.sendStatus(401);
  }

  jwt.verify(token!, process.env.AUTH_SECRET as string, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }

    req.user = user;

    next();
  });
}
