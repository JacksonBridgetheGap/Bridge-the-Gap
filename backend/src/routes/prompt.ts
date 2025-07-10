import express from "express";
import { PrismaClient } from "@prisma/client";
import { getResponseForPrompt } from "./gemini";

const prisma = new PrismaClient();

export const promptRouter = express.Router();

promptRouter.get("/api/:groupID/prompt", async (req, res) => {
  const { groupID } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id: Number(groupID) },
    });
    const prompt = await getResponseForPrompt();
    const updatedGroup = await prisma.group.update({
      where: { id: Number(groupID) },
      data: {
        prompt: prompt,
      },
    });
    res.json({ prompt, group });
  } catch (error) {
    res.status(400).json({ message: "Error getting prompt" });
  }
});
