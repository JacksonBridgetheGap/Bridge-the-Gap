import express from "express";

export default function isAuthenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
}
