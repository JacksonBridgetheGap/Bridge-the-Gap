import express from "express";
import { prisma } from "../prisma";
import { getResponseForPrompt } from "./gemini";
import isAuthenticated from "../middleware/is-authenticated";

export const promptRouter = express.Router();

const DAY_IN_MS = 1000 * 60 * 60 * 24;

promptRouter.get(
  "/api/groups/:groupID/prompt",
  isAuthenticated,
  async (req, res) => {
    const { groupID } = req.params;
    try {
      const group = await prisma.group.findUnique({
        where: { id: Number(groupID) },
      });
      const todaysDate = new Date().getTime();
      const lastUpdate = group!.promptLastUpdate.getTime();
      const timeSinceLastUpdate = (todaysDate - lastUpdate) / DAY_IN_MS;
      if (timeSinceLastUpdate >= 7 || group?.prompt === "") {
        const prompt = await getResponseForPrompt(group);
        const updatedGroup = await prisma.group.update({
          where: { id: Number(groupID) },
          data: {
            prompt: prompt,
            promptLastUpdate: new Date(),
            postFrequency: 0,
          },
        });
        await prisma.post.deleteMany({
          where: {
            groupID: Number(groupID),
          },
        });
        res.status(201).json({ prompt, updatedGroup });
      } else {
        res
          .status(200)
          .json({ message: "Prompt not updated yet. Try again in 7 days." });
      }
    } catch (error) {
      res.status(400).json({ message: "Error getting prompt", error: error });
    }
  },
);
