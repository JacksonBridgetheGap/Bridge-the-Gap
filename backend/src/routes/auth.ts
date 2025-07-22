import express from "express";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { hashPassword, verifyPassword } from "./argon";

export const authRouter = express.Router();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

authRouter.post("/api/auth/register", async (req, res) => {
  const { username, password, photo, email, location } = req.body;
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: username }, { email: email }] },
  });
  if (user === null) {
    const hash = await hashPassword(password);
    const offsetUTC = new Date().getTimezoneOffset();
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hash!,
        email,
        location,
        photo,
        offsetUTC,
      },
      omit: {
        password: true,
      },
    });
    req.session.userId = newUser.id;
    res.json({ newUser });
  } else {
    res.status(409).json({ message: "Username/Email already exists" });
  }
});

authRouter.post("/api/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload == null) {
      res.status(401).json({ message: "Invalid token" });
    }

    const user = await prisma.user.findFirst({
      where: { email: payload?.email },
    });

    if (user != null) {
      req.session.userId = user?.id;
      res.status(200).json({ user });
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error });
  }
});

authRouter.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { username },
    include: { groups: { include: { members: true } } },
  });
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
