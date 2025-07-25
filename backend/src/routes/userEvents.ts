import express from "express";
import { prisma } from "../prisma";
import isAuthenticated from "../middleware/is-authenticated";
import { createTimeSlotMap } from "../utils/dataUtils";
import { timeoutPromise } from "../utils/promise";
import optimalTimeSlot from "../algorithim/optimalTimeSlot";

export const userEventsRouter = express.Router();

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
      res.status(400).json({ message: "Error getting events", error: error });
    }
  },
);

userEventsRouter.post(
  "/api/user/:userId/optimalEvent",
  isAuthenticated,
  async (req, res) => {
    const { userId } = req.params;
    const { currentEventLength } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: {
          events: {
            include: {
              participants: true,
            },
          },
        },
      });

      if (user == null) {
        throw new Error("User not found");
      }

      const date = new Date();
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      const endOfWeek = new Date();
      const [timeSlotMap, timeSlotSet] = createTimeSlotMap([user]);
      timeoutPromise(
        5000,
        optimalTimeSlot(
          timeSlotSet,
          timeSlotMap,
          currentEventLength,
          date,
          new Date(endOfWeek.setDate(date.getDate() - (date.getDay() - 1) + 5)),
          Number(null),
          user.offsetUTC / 60,
        ),
      )
        .then((data) => {
          const slot = data.slot;
          const conflicts = data.conflicts;
          res.status(200).json({ slot, conflicts });
        })
        .catch(() => {
          res.status(500).json({ error: "Optimal time algorithm timed out" });
        });
    } catch (error) {
      res.status(500).json({ message: "Error getting events", error: error });
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
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      const event = await prisma.event.create({
        data: {
          text: text,
          start: new Date(start),
          end: new Date(end),
          participants: {
            connect: [{ id: user?.id }],
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
      const event = await prisma.event.findFirst({
        where: {
          id: Number(eventId),
          participants: { some: { id: Number(userId) } },
        },
        select: { id: true },
      });
      if (event) {
        await prisma.event.update({
          where: { id: Number(eventId) },
          data: {
            text: text,
            start: new Date(start),
            end: new Date(end),
          },
          include: {
            participants: true,
          },
        });
        res.status(200).json({ event });
      } else {
        throw new Error("Event not found for user");
      }
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

userEventsRouter.delete(
  "/api/user/:userId/groups/:groupId/events/:eventId",
  isAuthenticated,
  async (req, res) => {
    const { userId, groupId, eventId } = req.params;
    try {
      const group = await prisma.group.findFirst({
        where: { id: Number(groupId) },
      });

      if (group != null) {
        const user = await prisma.user.update({
          where: { id: Number(userId) },
          data: {
            events: {
              disconnect: [{ id: Number(eventId) }],
            },
          },
        });
        res.status(200).json({ user });
      } else {
        res.status(400).json({ message: "Group not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Error deleting event", error: error });
    }
  },
);
