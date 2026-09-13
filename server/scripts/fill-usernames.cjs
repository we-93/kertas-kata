const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

async function main() {
  const users = await prisma.user.findMany({
    where: { username: null }
  });

  for (const user of users) {
    let baseSlug = slugify(user.name);
    if (!baseSlug) baseSlug = "user";
    
    // Check if exists
    let existing = await prisma.user.findUnique({ where: { username: baseSlug } });
    if (existing) {
      // If collision, just append first 4 of ID
      baseSlug = `${baseSlug}-${user.id.substring(0, 4)}`;
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: { username: baseSlug }
    });
    console.log(`Updated user ${user.id} with username ${baseSlug}`);
  }
  console.log("Done backfilling usernames.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
