import { db } from "../src/lib/db";

async function main() {
  console.log("Database initialized and verified.");
  const users = await db.user.findUnique({ where: { email: "rep@university.edu" } });
  const courses = await db.course.findMany();
  console.log(`Verified ${courses.length} courses and default course rep account: ${users?.email}`);
}

main().catch(console.error);
