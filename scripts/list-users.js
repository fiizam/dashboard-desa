const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({ include: { role: true } })
  console.log(users.map(u => ({ id: u.id, name: u.name, username: u.username, role: u.role?.name })))
}

main().finally(() => prisma.$disconnect())
