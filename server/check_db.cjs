const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(`Total users in DB: ${users.length}`);
  if (users.length > 0) {
    console.log(users.map(u => `- ${u.email} (Role: ${u.role})`).join('\n'));
  } else {
    console.log("No users found in database.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
