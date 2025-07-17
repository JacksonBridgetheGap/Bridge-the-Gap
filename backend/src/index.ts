import express from "express";
import session from "express-session";
import { Prisma, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import isAuthenticated from "./middleware/is-authenticated";
import { routes } from "./routes";
import cors from "cors";
import morgan from "morgan";
import recommendations from "./algorithim/recommendations";
import { UserWithGroupsAndCircle } from "./types/types";

const prisma = new PrismaClient({
  omit: { user: { password: true } },
}).$extends(withAccelerate());

const app: express.Application = express();
app.use(express.json());

app.use(cors());
app.set("trust proxy", 1); // works alongside "secure" cookie setting
app.use(morgan("tiny"));
app.use(
  session({
    name: "sessionId",
    secret: process.env.AUTH_SECRET || "secret",
    cookie: {
      maxAge: 1000 * 60 * 5,
      secure: process.env.RENDER ? true : false,
      httpOnly: false,
    },
    resave: false,
    saveUninitialized: false,
  }),
);
app.use("/", routes);

const port: number = 3000;

//---------------------GROUP ROUTING--------------------//

//  [GET] /groups
app.get("/api/groups", async (req, res, next): Promise<void> => {
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
});

// [GET] /api/users/:userID/recommendations
app.get(
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
    const groups = await recommendations(user);
    res.json(groups);
  },
);

// [GET] /groups/:id
app.get("/api/groups/:id", async (req, res, next): Promise<void> => {
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
app.post("/api/groups", async (req, res, next): Promise<void> => {
  const { name, img, members, tags } = req.body;
  try {
    const memberIds = members?.map((member: any) => {
      return member.id;
    });

    //Add all data to database
    const group = await prisma.group.create({
      data: {
        name,
        img,
        tags,
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
app.put("/api/groups/:id", async (req, res, next): Promise<void> => {
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
app.delete("/api/groups/:id", async (req, res, next): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await prisma.group.delete({
      where: { id: Number(id) },
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

//------------------------------------------------------//

//---------------------USER ROUTING---------------------//

// [GET] /users
app.get("/api/users", async (req, res, next): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// [GET] /me
// Get the currently logged in user based on the session
app.get("/api/me", isAuthenticated, async (req, res, next): Promise<void> => {
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
});

// [GET] /api/user/:userID/groups
app.get(
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
app.put(
  "/api/user/:userID/groups",
  isAuthenticated,
  async (req, res, next): Promise<void> => {
    const { userID } = req.params;
    const { groupId } = req.body;
    try {
      const group = await prisma.group.findUnique({
        where: { id: Number(groupId) },
        include: { members: true, events: true },
      });
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
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

//  [PUT] /users/:id
app.put("/api/users/:id", async (req, res, next): Promise<void> => {
  const { id } = req.params;
  const { username, password, photo, location, email, groups } = req.body;

  const groupData = groups?.map((group: Prisma.GroupCreateInput) => {
    return {
      name: group?.name,
      img: group?.img,
      members: {
        create: group?.members,
      },
    };
  });

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username,
        password,
        photo,
        location,
        email,
        groups: {
          connect: groupData,
        },
      },
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// [DELETE] /users/:id
app.delete("/api/users/:id", async (req, res, next): Promise<void> => {
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

//------------------------------------------------------//

//---------------------POST ROUTING---------------------//

//  [GET] /groups/:id/posts
app.get("/api/groups/:id/posts", async (req, res, next): Promise<void> => {
  const { id } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id: Number(id) },
      include: { posts: true },
    });
    res.json(group?.posts);
  } catch (error) {
    next(error);
  }
});

//  [POST] /groups/:id/posts
app.post("/api/groups/:id/posts", async (req, res, next): Promise<void> => {
  const { id } = req.params;
  const groupId = Number(id);
  const { title, img, description } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        img,
        description,
        groupID: groupId,
      },
    });
    await prisma.group.update({
      where: { id: groupId },
      data: {
        posts: {
          connect: { id: post.id },
        },
      },
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
});

//  [DELETE] /groups/:groupId/posts/:postId
app.delete(
  "/api/groups/:groupId/posts/:postId",
  async (req, res, next): Promise<void> => {
    const groupId = req.params.groupId;
    const postId = req.params.postId;
    try {
      const post = await prisma.post.findFirst({
        where: { id: Number(postId), groupID: Number(groupId) },
      });
      if (post) {
        await prisma.post.delete({ where: { id: Number(postId) } });
        res.json(post);
      } else {
        throw new Error("Post not found for group");
      }
    } catch (error) {
      next(error);
    }
  },
);

//------------------------------------------------------//

//**RUN SERVER ON PORT**//
app.listen(port, (): void => {
  console.log(`Server listening at http://localhost:${port}`);
});
