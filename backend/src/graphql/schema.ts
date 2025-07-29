import { buildSchema } from "graphql";
import { prisma } from "../prisma";

export const schema = buildSchema(`
  type Query {
    getUser(id: Int!): User
    allUsers: [User]!
    getGroup(id: Int!): Group
    allGroups: [Group]!
  }
  
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    location: String!
    photo: String!
    offsetUTC: Int!
    circle: [User!]!
    inCircle: [User!]!
    groups: [Group!]!
    events: [Event!]!
  }
  
  type Group {
    id: ID!
    name: String!
    img: String!
    members: [User!]!
    tags: [String!]!
    prompt: String!
    promptLastUpdate: Date!
    events: [Event!]!
    averageOffsetUTC: Float!
    averageEventLength: Int!
    postFrequency: Float!
  }
  
  type Event {
    id: ID!
    text: String!
    start: Date!
    end: Date!
    participants: [User!]!
    group: Group
  }
  
  scalar Date
`);

export const resolvers = {
  getUser: async ({ id }: { id: number }) => {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        circle: true,
        inCircle: true,
        events: { include: { group: true } },
        groups: { include: { members: true } },
      },
    });
    return user;
  },
  allUsers: async () => {
    const users = await prisma.user.findMany();
    return users;
  },
  getGroup: async ({ id }: { id: number }) => {
    const group = await prisma.group.findUnique({
      where: { id },
      include: { members: true, events: true, posts: true },
    });
    return group;
  },
  allGroups: async () => {
    const groups = await prisma.group.findMany({ include: { members: true } });
    return groups;
  },
};
