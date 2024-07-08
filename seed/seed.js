const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Starting to create users...");

    const user1 = await prisma.user.create({
      data: {
        username: 'albert',
        password: 'bertie99',
        posts: {
          create: {
            title: "First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them."
          }
        }
      }
    });

    const user2 = await prisma.user.create({
      data: {
        username: 'sandra',
        password: '2sandy4me',
        posts: {
          create: {
            title: "How does this work?",
            content: "Seriously, does this even do anything?"
          }
        }
      }
    });

    const user3 = await prisma.user.create({
      data: {
        username: 'glamgal',
        password: 'soglam',
        posts: {
          create: {
            title: "Living the Glam Life",
            content: "Do you even? I swear that half of you are posing."
          }
        }
      }
    });

    console.log("Finished creating users!");

    console.log("Starting to create posts...");

    console.log("Finished creating posts!");

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
