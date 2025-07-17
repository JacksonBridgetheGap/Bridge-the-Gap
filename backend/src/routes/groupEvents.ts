import express from "express";
import { PrismaClient } from "@prisma/client";
import isAuthenticated from "../middleware/is-authenticated";

export const groupEventsRouter = express.Router();
const prisma = new PrismaClient();

groupEventsRouter.get(
  "/api/group/:groupId/events",
  isAuthenticated,
  async (req, res) => {
    const { groupId } = req.params;
    try {
      const group = await prisma.group.findUnique({
        where: { id: Number(groupId) },
        include: {
          events: { select: { id: true, text: true, start: true, end: true } },
        },
      });
      res.status(200).json({ events: group?.events });
    } catch (error) {
      res.status(400).json({ message: "Error getting events", error: error });
    }
  },
);

groupEventsRouter.post(
  "/api/group/:groupId/events",
  isAuthenticated,
  async (req, res) => {
    const { groupId } = req.params;
    const { text, start, end } = req.body;
    try {
      const event = await prisma.groupEvent.create({
        data: {
          text: text,
          start: new Date(start),
          end: new Date(end),
          groupId: Number(groupId),
        },
      });
      res.status(201).json({ event });
    } catch (error) {
      res.status(400).json({ message: "Error creating event", error: error });
    }
  },
);

groupEventsRouter.put(
  "/api/group/:groupId/events/:eventId",
  isAuthenticated,
  async (req, res) => {
    const { groupId, eventId } = req.params;
    const { text, start, end } = req.body;
    try {
      const event = await prisma.groupEvent.update({
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

groupEventsRouter.delete(
  "/api/group/:groupId/events/:eventId",
  isAuthenticated,
  async (req, res) => {
    const { groupId, eventId } = req.params;
    try {
      const group = await prisma.group.update({
        where: { id: Number(groupId) },
        data: {
          events: {
            delete: [{ id: Number(eventId) }],
          },
        },
      });
      res.status(200).json({ group });
    } catch (error) {
      res.status(400).json({ message: "Error deleting event", error: error });
    }
  },
);
