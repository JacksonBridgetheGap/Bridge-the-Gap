import express from "express";
import { PrismaClient } from "@prisma/client";
import optimalTimeSlot from "../algorithim/optimalTimeSlot";
import { TimeSlot } from "../utils/TimeSlot";
import { createTimeSlotMap } from "../utils/dataUtils";
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

groupEventsRouter.get(
  "/api/group/:groupId/optimalEvent",
  isAuthenticated,
  async (req, res) => {
    const { groupId } = req.params;
    try {
      const group = await prisma.group.findUnique({
        where: { id: Number(groupId) },
        include: {
          members: {
            include: { events: true },
          },
        },
      });
      const date = new Date();
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      const endOfWeek = new Date();
      const [timeSlotMap, timeSlotSet] = createTimeSlotMap(group!.members);
      const { slot, conflicts } = optimalTimeSlot(
        timeSlotSet,
        timeSlotMap,
        group!.averageEventLength,
        date,
        new Date(endOfWeek.setDate(date.getDate() - (date.getDay() - 1) + 5)),
        Number(groupId),
      );
      res.status(200).json({ slot, conflicts });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error during events optimization", error: error });
    }
  },
);

groupEventsRouter.post(
  "/api/group/:groupId/events",
  isAuthenticated,
  async (req, res) => {
    const { groupId } = req.params;
    const { text, start, end, members } = req.body;
    try {
      const startDateTime = new Date(start);
      const endDateTime = new Date(end);
      const event = await prisma.event.create({
        data: {
          text: text,
          start: startDateTime,
          end: endDateTime,
          group: {
            connect: {
              id: Number(groupId),
            },
          },
          participants: {
            connect: members.map((member: any) => ({ id: member.id })),
          },
        },
        include: {
          participants: true,
        },
      });
      const eventLength =
        (endDateTime.getTime() - startDateTime.getTime()) / 1000 / 60;
      const group = await prisma.group.findUnique({
        where: { id: Number(groupId) },
        include: { events: true },
      });
      await prisma.group.update({
        where: { id: Number(groupId) },
        data: {
          averageEventLength:
            (group?.averageEventLength! * group?.events?.length! +
              eventLength) /
            (group?.events?.length! + 1),
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
    const { text, start, end, members } = req.body;
    try {
      const event = await prisma.event.update({
        where: { id: Number(eventId) },
        data: {
          text: text,
          start: new Date(start),
          end: new Date(end),
          groupID: Number(groupId),
          participants: {
            connect: [members.map((member: any) => ({ id: member.id }))],
          },
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
      const event = prisma.event.findFirst({
        where: { id: Number(eventId), groupID: Number(groupId) },
      });
      if (event) {
        await prisma.event.delete({ where: { id: Number(eventId) } });
        res.status(200).json(event);
      } else {
        throw new Error("Event not found for group");
      }
    } catch (error) {
      res.status(400).json({ message: "Error deleting event", error: error });
    }
  },
);
