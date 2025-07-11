import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    username: "User0",
    password: "123",
    photo: "/default_profile_pic.jpg",
    location: "CA",
    email: null,
  },
  {
    username: "User1",
    password: "123",
    photo: "/default_profile_pic.jpg",
    location: "CA",
    email: null,
  },
  {
    username: "User2",
    password: "123",
    photo: "/default_profile_pic.jpg",
    location: "CA",
    email: null,
  },
  {
    username: "User3",
    password: "123",
    photo: "/default_profile_pic.jpg",
    location: "CA",
    email: null,
  },
  {
    username: "User4",
    password: "123",
    photo: "/default_profile_pic.jpg",
    location: "CA",
    email: null,
  },
];

const groupData: Prisma.GroupCreateInput[] = [
  {
    name: "Group0",
    img: "/deafult_group_pic.png",
    tags: ["food", "education"],
  },
  {
    name: "Group1",
    img: "/deafult_group_pic.png",
    tags: ["hobbies", "gaming", "education"],
  },
  {
    name: "Group2",
    img: "/deafult_group_pic.png",
    tags: ["buissness", "travel"],
  },
  {
    name: "Group3",
    img: "/deafult_group_pic.png",
    tags: ["pets", "health", "education"],
  },
  {
    name: "Group4",
    img: "/deafult_group_pic.png",
    tags: ["gaming", "miscellaneous"],
  },
];

async function main() {
  console.log(`Start seeding ...`);
  console.log("Begin user seeding");
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`User seeding finished....`);
  console.log("Begin group seeding");
  for (const g of groupData) {
    const group = await prisma.group.create({
      data: g,
    });
    await prisma.group.update({
      where: { id: group.id },
      data: {
        members: {
          connect: [
            {
              id: 1,
            },
            {
              id: 2,
            },
            {
              id: 3,
            },
            {
              id: 4,
            },
            {
              id: 5,
            },
          ],
        },
      },
    });
    console.log(`Created group with id: ${group.id}`);
  }
  console.log(`Group seeding finished...`);
  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
