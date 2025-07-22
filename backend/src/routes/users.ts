import express from "express";
import { prisma } from "../prisma";
import isAuthenticated from "../middleware/is-authenticated";

export const usersRouter = express.Router();

// [GET] /users
usersRouter.get("/api/users", async (req, res, next): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// [GET] /me
// Get the currently logged in user based on the session
usersRouter.get(
  "/api/me",
  isAuthenticated,
  async (req, res, next): Promise<void> => {
    const id = req.session.userId;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: {
          inCircle: true,
          circle: true,
          groups: { include: { members: true } },
          events: { include: { group: true } },
        },
      });
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

// [GET] /api/user/:userID/groups
usersRouter.get(
  "/api/user/:userID/groups",
  isAuthenticated,
  async (req, res, next): Promise<void> => {
    const { userID } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userID) },
        include: { groups: { include: { members: true, events: true } } },
      });
      res.json(user?.groups);
    } catch (error) {
      next(error);
    }
  },
);

// PUT /api/user/:userID/groups
usersRouter.put(
  "/api/user/:userID/groups",
  isAuthenticated,
  async (req, res, next): Promise<void> => {
    const { userID } = req.params;
    const { groupId } = req.body;
    try {
      const group = await prisma.group.findUnique({
        where: { id: Number(groupId) },
        include: { members: true, events: true, posts: true },
      });
      if (group) {
        const user = await prisma.user.update({
          where: { id: Number(userID) },
          data: {
            groups: {
              connect: { id: Number(groupId) },
            },
            circle: {
              connect: group?.members.map((member) => ({ id: member.id })),
            },
            events: {
              connect: group?.events.map((event) => ({ id: event.id })),
            },
          },
        });
        await prisma.group.update({
          where: { id: Number(groupId) },
          data: {
            averageOffsetUTC:
              (group?.averageOffsetUTC! * group?.members?.length! +
                user.offsetUTC) /
              (group?.members?.length! + 1),
            postFrequency: group?.posts.length! / (group?.members?.length! + 1),
          },
        });
        res.json(user);
      } else {
        throw new Error("Group not found");
      }
    } catch (error) {
      next(error);
    }
  },
);

//  [PUT] /users/:id
usersRouter.put("/api/users/:id", async (req, res, next): Promise<void> => {
  const { id } = req.params;
  const { username, password, photo, location, email, offsetUTC } = req.body;

  try {
    const user = await prisma.user.findFirst({ where: { id: Number(id) } });

    if (user) {
      const result = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          username,
          password,
          photo,
          location,
          email,
          offsetUTC,
        },
        include: {
          inCircle: true,
          circle: true,
          groups: { include: { members: true } },
          events: { include: { group: true } },
        },
      });

      for (const group of result.groups) {
        if (offsetUTC) {
          await prisma.group.update({
            where: { id: group.id },
            data: {
              averageOffsetUTC:
                (group.averageOffsetUTC! * group.members?.length! -
                  user.offsetUTC +
                  offsetUTC) /
                group.members?.length!,
            },
          });
        }
      }

      res.json(result);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
});

// [DELETE] /users/:id
usersRouter.delete("/api/users/:id", async (req, res, next): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});
