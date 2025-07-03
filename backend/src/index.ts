import express from "express";
import session from "express-session";
import { Prisma, PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { routes } from "./routes";
import cors from "cors";
import morgan from "morgan";

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
    secret: "keep it secret, keep it safe", //TODO: Read Secret from .env file
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
  try {
    const groups = await prisma.group.findMany({ include: { members: true } });
    res.json(groups);
  } catch (error) {
    next(error);
  }
});

// [GET] /groups/:id
app.get("/api/groups/:id", async (req, res, next): Promise<void> => {
  const { id } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id: Number(id) },
      include: { members: true, posts: true },
    });
    res.json(group);
  } catch (error) {
    next(error);
  }
});

// [POST] /groups
app.post("/api/groups", async (req, res, next): Promise<void> => {
  const { name, img, members, posts } = req.body;
  try {
    const memberData = members?.map((user: Prisma.UserCreateInput) => {
      return {
        username: user?.username,
        photo: user?.photo,
        location: user?.location,
        password: user?.password,
      };
    });

    //Add all data to database
    const data = await prisma.group.create({
      data: {
        name,
        img,
        members: {
          connect: memberData,
        },
      },
    });
    res.json({ data });
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

// [GET] /user
// Get the currently logged in user based on the session
app.get("/api/me", async (req, res, next): Promise<void> => {
  if (req.session.userId) {
    const id = req.session.userId;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: { groups: { include: { members: true } } },
      });
      res.json(user);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// [GET] /api/user/groups
app.get("/api/user/groups", async (req, res, next): Promise<void> => {
  if (req.session.userId) {
    const id = req.session.userId;
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        include: { groups: { include: { members: true } } },
      });
      res.json(user?.groups);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

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
    const group = await prisma.group.update({
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
      const result = await prisma.post.delete({
        where: { id: Number(postId) },
      });
      res.json(result);
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
