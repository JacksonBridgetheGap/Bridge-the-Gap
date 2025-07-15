import express from "express";
import { PrismaClient } from "@prisma/client";
import isAuthenticated from "../middleware/is-authenticated";

export const userEventsRouter = express.Router();
const prisma = new PrismaClient();

userEventsRouter.get(
  "/api/user/:userId/events",
  isAuthenticated,
  async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          events: { select: { id: true, text: true, start: true, end: true } },
        },
      });
      res.status(200).json({ events: user?.events });
    } catch (error) {
      res.status(400).json({ message: "Error getting events" });
    }
  },
);

userEventsRouter.post(
  "/api/user/:userId/events",
  isAuthenticated,
  async (req, res) => {
    const { userId } = req.params;
    const { text, start, end } = req.body;
    try {
      const event = await prisma.userEvent.create({
        data: {
          text: text,
          start: new Date(start),
          end: new Date(end),
          userId: Number(userId),
        },
      });

      const user = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          events: {
            connect: { id: event.id },
          },
        },
      });
      res.status(201).json({ event });
    } catch (error) {
      res.status(500).json({ message: "Error creating event", error: error });
    }
  },
);

userEventsRouter.put(
  "/api/user/:userId/events/:eventId",
  isAuthenticated,
  async (req, res) => {
    const { userId, eventId } = req.params;
    const { text, start, end } = req.body;
    try {
      const event = await prisma.userEvent.update({
        where: { id: Number(eventId) },
        data: {
          text: text,
          start: new Date(start),
          end: new Date(end),
        },
      });
      res.status(200).json({ event });
    } catch (error) {
      res.status(400).json({ message: "Error updating event", error: error });
    }
  },
);

userEventsRouter.delete(
  "/api/user/:userId/events/:eventId",
  isAuthenticated,
  async (req, res) => {
    const { userId, eventId } = req.params;
    try {
      const user = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          events: {
            delete: [{ id: Number(eventId) }],
          },
        },
      });
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ message: "Error deleting event", error: error });
    }
  },
);
