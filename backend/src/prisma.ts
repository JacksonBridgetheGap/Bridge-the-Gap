import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient({
  omit: { user: { password: true } },
}).$extends(withAccelerate());
