import { Prisma } from "@prisma/client";

type UserWithGroupsAndCircle = Prisma.UserGetPayload<{
  include: { groups: true; circle: true; inCircle: true };
}>;

type GroupWithMembers = {
  members: any[];
} & Awaited<ReturnType<typeof prisma.group.findMany>>[number];

type UserWithEvents = Prisma.UserGetPayload<{
  include: { events: true };
}>;

type Groups = Prisma.GroupGetPayload<{
  include: { members: true; events: true };
}>;
