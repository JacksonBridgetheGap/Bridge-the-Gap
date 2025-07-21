import express from "express";
import { prisma } from "../../prisma/prisma";

export const postsRouter = express.Router();

//  [GET] /groups/:id/posts
postsRouter.get(
  "/api/groups/:id/posts",
  async (req, res, next): Promise<void> => {
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
  },
);

//  [POST] /groups/:id/posts
postsRouter.post(
  "/api/groups/:id/posts",
  async (req, res, next): Promise<void> => {
    const { id } = req.params;
    const groupId = Number(id);
    const { title, img, description, author } = req.body;
    try {
      const post = await prisma.post.create({
        data: {
          title,
          img,
          description,
          author,
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
  },
);

//  [DELETE] /groups/:groupId/posts/:postId
postsRouter.delete(
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
