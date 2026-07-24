const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  console.log('DATABASE_URL is:', process.env.DATABASE_URL);
  const u = await prisma.user.findUnique({where:{username:'rt06admin'}, include:{role:true}});
  console.log('user id:', u.id, 'role:', u.role.name);
}
main().finally(()=>prisma.$disconnect());
