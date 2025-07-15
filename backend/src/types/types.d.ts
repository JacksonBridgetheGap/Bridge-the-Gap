//USER TYPE:
// Store part of the user information with the session
// Should be better than having to search for our user in the DB everytime for simple information
import { Prisma } from "@prisma/client";

interface User {
  username: string;
  id: number;
}

type UserWithGroupsAndCircle = Prisma.UserGetPayload<{
  include: { groups: true; circle: true; inCircle: true };
}>;

type GroupWithMembers = {
  members: any[];
} & Awaited<ReturnType<typeof prisma.group.findMany>>[number];

type UserWithEvents = Prisma.UserGetPayload<{
  include: { events: true };
}>;
