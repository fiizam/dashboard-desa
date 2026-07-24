const { PrismaClient } = require('../src/generated/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Memulai migrasi struktur Role ke lingkup RW...')

  // 1. Definisikan role-role baru
  const newRoles = [
    { name: 'Super Admin', permissions: '*' },
    { name: 'Ketua RW', permissions: '*' },
    { name: 'Wakil Ketua RW', permissions: '*' },
    { name: 'Sekretaris', permissions: 'dashboard,master,laporan,settings' },
    { name: 'Bendahara', permissions: 'dashboard,keuangan,laporan,settings' }
  ]

  // Upsert roles
  const roleMap = {}
  for (const role of newRoles) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: { permissions: role.permissions },
      create: role
    })
    roleMap[role.name] = created.id
    console.log(`Role [${role.name}] berhasil dipastikan ada.`)
  }

  // 2. Cari desa/RW pertama sebagai referensi
  let desa = await prisma.desa.findFirst()
  if (!desa) {
    console.log('Tidak ada entitas Desa/RW ditemukan, membatalkan pembuatan user...')
    return
  }

  // 3. Promosikan rt06admin menjadi Super Admin
  const adminUser = await prisma.user.findUnique({ where: { username: 'rt06admin' } })
  if (adminUser) {
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { roleId: roleMap['Super Admin'] }
    })
    console.log(`Akun [rt06admin] telah DIPROMOSIKAN menjadi Super Admin!`)
  }

  // 4. Buatkan akun-akun jajaran RW default
  const defaultPassword = await bcrypt.hash('rw123456', 10)
  const defaultUsers = [
    {
      name: 'Ketua RW',
      username: 'ketuarw',
      email: 'ketua@rw.id',
      password: defaultPassword,
      roleId: roleMap['Ketua RW'],
      desaId: desa.id,
      isActive: true
    },
    {
      name: 'Wakil Ketua RW',
      username: 'wakilrw',
      email: 'wakil@rw.id',
      password: defaultPassword,
      roleId: roleMap['Wakil Ketua RW'],
      desaId: desa.id,
      isActive: true
    },
    {
      name: 'Sekretaris RW',
      username: 'sekretarisrw',
      email: 'sekretaris@rw.id',
      password: defaultPassword,
      roleId: roleMap['Sekretaris'],
      desaId: desa.id,
      isActive: true
    },
    {
      name: 'Bendahara RW',
      username: 'bendahararw',
      email: 'bendahara@rw.id',
      password: defaultPassword,
      roleId: roleMap['Bendahara'],
      desaId: desa.id,
      isActive: true
    }
  ]

  for (const user of defaultUsers) {
    const existing = await prisma.user.findUnique({ where: { username: user.username } })
    if (!existing) {
      await prisma.user.create({ data: user })
      console.log(`Akun [${user.username}] berhasil diciptakan.`)
    } else {
      await prisma.user.update({
        where: { id: existing.id },
        data: { roleId: user.roleId }
      })
      console.log(`Akun [${user.username}] sudah ada, role diperbarui.`)
    }
  }

  console.log('Restrukturisasi Role RW selesai dengan sukses!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
