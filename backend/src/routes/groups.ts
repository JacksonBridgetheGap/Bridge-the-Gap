import express from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { UserWithGroupsAndCircle } from "../types/types";
import { timeoutPromise } from "../utils/promise";
import recommendations from "../algorithim/recommendations";
import isAuthenticated from "../middleware/is-authenticated";

export const groupsRouter = express.Router();

//  [GET] /groups
groupsRouter.get(
  "/api/groups",
  isAuthenticated,
  async (req, res, next): Promise<void> => {
    const query = req.query;
    const name: string = query.name! as string;
    try {
      const groups = await prisma.group.findMany({
        where: {
          name: { contains: name },
        },
        include: { members: true },
      });
      res.json(groups);
    } catch (error) {
      next(error);
    }
  },
);

// [GET] /api/users/:userID/recommendations
groupsRouter.get(
  "/api/user/:userID/recommendations",
  isAuthenticated,
  async (req, res): Promise<void> => {
    const { userID } = req.params;
    const user: UserWithGroupsAndCircle | null = await prisma.user.findUnique({
      where: { id: Number(userID) },
      include: { groups: true, circle: true, inCircle: true },
    });
    if (user === null) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    timeoutPromise(5000, recommendations(user))
      .then((groups) => res.json(groups))
      .catch((error) => res.status(400).json({ message: error }));
  },
);

// [GET] /groups/:id
groupsRouter.get("/api/groups/:id", async (req, res, next): Promise<void> => {
  const { id } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id: Number(id) },
      include: { members: true, posts: true, events: true },
    });
    res.json(group);
  } catch (error) {
    next(error);
  }
});

// [POST] /groups
groupsRouter.post("/api/groups", async (req, res, next): Promise<void> => {
  const { name, img, members, tags } = req.body;
  try {
    const memberIds = members?.map((member: any) => {
      return member.id;
    });

    const averageOffsetUTC =
      members?.reduce((acc: number, cur: any) => {
        return acc + cur.offsetUTC;
      }, 0) / memberIds?.length;

    const group = await prisma.group.create({
      data: {
        name,
        img,
        tags,
        promptLastUpdate: new Date(),
        averageOffsetUTC: averageOffsetUTC,
        members: {
          connect: memberIds.map((id: number) => ({ id })),
        },
      },
      include: {
        members: true,
      },
    });

    for (const id of memberIds) {
      const otherIds = memberIds.filter((otherId: number) => otherId !== id);
      await prisma.user.update({
        where: { id: id },
        data: {
          circle: {
            connect: otherIds.map((id: number) => ({ id })),
          },
        },
      });
    }
    res.json(group);
  } catch (error) {
    next(error);
  }
});

// [PUT] /groups/:id
groupsRouter.put("/api/groups/:id", async (req, res, next): Promise<void> => {
  const { id } = req.params;
  const { name, img, members, posts } = req.body;
  try {
    //Need to bundle member and post data to add to groups
    const memberData = members?.map((user: Prisma.UserCreateInput) => {
      return {
        username: user?.username,
        photo: user?.photo,
        location: user?.location,
        password: user?.password,
      };
    });

    const postData = posts?.map((post: Prisma.PostCreateInput) => {
      return {
        title: post?.title,
        img: post?.img,
        description: post?.description,
      };
    });

    const result = await prisma.group.update({
      where: { id: Number(id) },
      data: {
        name,
        img,
        members: {
          create: memberData,
        },
        posts: {
          create: postData,
        },
      },
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// [DELETE] /groups/:id
groupsRouter.delete(
  "/api/groups/:id",
  async (req, res, next): Promise<void> => {
    const { id } = req.params;
    try {
      const result = await prisma.group.delete({
        where: { id: Number(id) },
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
