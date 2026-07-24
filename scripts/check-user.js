const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { username: 'rt06admin' },
    include: { role: true }
  })
  
  if (user) {
    console.log(`User: ${user.username}`)
    console.log(`Role: ${user.role.name}`)
  } else {
    console.log('User not found')
  }

  const allRoles = await prisma.role.findMany()
  console.log('Available roles:', allRoles.map(r => r.name))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
