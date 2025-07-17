import express from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "./argon";

export const authRouter = express.Router();
const prisma = new PrismaClient();

authRouter.post("/api/auth/register", async (req, res) => {
  //Check the username for uniqness
  const { username, password, photo, email, location } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (user === null) {
    //Hash password and write user to db
    const hash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hash!,
        email,
        location,
        photo,
      },
      omit: {
        password: true,
      },
    });
    req.session.userId = newUser.id;
    res.json({ newUser });
  } else {
    res.status(400).json({ message: "Username already exists" });
  }
});

authRouter.post("/api/auth/login", async (req, res) => {
  //Check if username exists
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username },
    include: { groups: { include: { members: true } } },
  });
  //Check if password matches stored password if user exists
  if (user !== null && (await verifyPassword(password, user.password))) {
    req.session.userId = user.id;
    const { password: _password, ...rest } = user;
    res.json({ user: rest });
  } else {
    res.status(400).json({ message: "Invalid username or password" });
  }
});

authRouter.post("/api/auth/logout", (req, res) => {
  //destroy session
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send({ message: "Error logging out" });
      }
      res.clearCookie("sessionId", { path: "/" });
      res.json({ message: "Logged out" });
    });
  } else {
    res.end();
  }
});

authRouter.get("/api/auth/session", async (req, res) => {
  const userExists = req.session.userId ? true : false;
  res.json({ userExists });
});
