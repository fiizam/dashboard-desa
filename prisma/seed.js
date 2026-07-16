const { PrismaClient } = require('../src/generated/client')
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing data
  await prisma.logAktivitas.deleteMany()
  await prisma.transaksiPendapatan.deleteMany()
  await prisma.transaksiBelanja.deleteMany()
  await prisma.pendapatan.deleteMany()
  await prisma.belanja.deleteMany()
  await prisma.pembiayaan.deleteMany()
  await prisma.apbdes.deleteMany()
  await prisma.sumberDana.deleteMany()
  await prisma.kategoriPendapatan.deleteMany()
  await prisma.kategoriBelanja.deleteMany()
  await prisma.kegiatan.deleteMany()
  await prisma.bidang.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  await prisma.desa.deleteMany()
  await prisma.kecamatan.deleteMany()
  await prisma.kabupaten.deleteMany()
  await prisma.provinsi.deleteMany()

  // 1. Seed Roles
  const roleAdmin = await prisma.role.create({
    data: {
      name: 'Admin',
      permissions: JSON.stringify(['ALL']),
    },
  })

  const roleUser = await prisma.role.create({
    data: {
      name: 'User',
      permissions: JSON.stringify(['VIEW_DASHBOARD', 'SUBMIT_REQUEST']),
    },
  })

  // 2. Seed Admin User
  const hashedPassword = await bcrypt.hash('admin0619', 10)
  const user = await prisma.user.create({
    data: {
      name: 'Administrator',
      username: 'rt06admin',
      email: 'admin@desa.com',
      password: hashedPassword,
      roleId: roleAdmin.id,
      avatarUrl: faker.image.avatar(),
    },
  })
  
  const normalUser = await prisma.user.create({
    data: {
      name: 'Desa User',
      username: 'rt06user',
      email: 'user@desa.com',
      password: hashedPassword,
      roleId: roleUser.id,
      avatarUrl: faker.image.avatar(),
    },
  })

  console.log('Seeded Users:', user.username, normalUser.username)

  // 3. Seed Wilayah (Provinsi, Kabupaten, Kecamatan, Desa)
  const provinsi = await prisma.provinsi.create({
    data: { name: 'Jawa Barat' },
  })

  const kabupaten = await prisma.kabupaten.create({
    data: { name: 'Kabupaten Bogor', provinsiId: provinsi.id },
  })

  const kecamatan = await prisma.kecamatan.create({
    data: { name: 'Cibinong', kabupatenId: kabupaten.id },
  })

  const desa = await prisma.desa.create({
    data: {
      name: 'Desa Sukamaju',
      kepalaDesa: 'Budi Santoso',
      nip: '198001012010011001',
      alamat: 'Jl. Pemuda No. 1',
      kecamatanId: kecamatan.id,
    },
  })

  await prisma.user.updateMany({
    where: { id: { in: [user.id, normalUser.id] } },
    data: { desaId: desa.id },
  })

  console.log('Seeded Desa:', desa.name)

  // 4. Seed APBDes
  const apbdes = await prisma.apbdes.create({
    data: {
      tahun: new Date().getFullYear(),
      status: 'ACTIVE',
      desaId: desa.id,
    },
  })

  // 5. Seed Sumber Dana & Kategori
  const sumberDanaDD = await prisma.sumberDana.create({
    data: { kode: 'DD', name: 'Dana Desa', keterangan: 'Dana Desa dari APBN' },
  })
  const sumberDanaADD = await prisma.sumberDana.create({
    data: { kode: 'ADD', name: 'Alokasi Dana Desa', keterangan: 'Alokasi dari Kabupaten' },
  })
  const sumberDanaPAD = await prisma.sumberDana.create({
    data: { kode: 'PAD', name: 'PADes', keterangan: 'Pendapatan Asli Desa' },
  })
  const sumberDanas = [sumberDanaDD, sumberDanaADD, sumberDanaPAD]

  const katPendTransfer = await prisma.kategoriPendapatan.create({
    data: { kode: '4.1', name: 'Pendapatan Transfer' },
  })
  const katPendAsli = await prisma.kategoriPendapatan.create({
    data: { kode: '4.2', name: 'Pendapatan Asli Desa' },
  })
  const katsPendapatan = [katPendTransfer, katPendAsli]

  const katBelanjaPegawai = await prisma.kategoriBelanja.create({
    data: { kode: '5.1', name: 'Belanja Pegawai' },
  })
  const katBelanjaBarang = await prisma.kategoriBelanja.create({
    data: { kode: '5.2', name: 'Belanja Barang dan Jasa' },
  })
  const katBelanjaModal = await prisma.kategoriBelanja.create({
    data: { kode: '5.3', name: 'Belanja Modal' },
  })
  const katsBelanja = [katBelanjaPegawai, katBelanjaBarang, katBelanjaModal]

  // Bidang & Kegiatan
  const bidangPem = await prisma.bidang.create({
    data: { kode: '1', name: 'Penyelenggaraan Pemerintahan Desa' },
  })
  const bidangPembangunan = await prisma.bidang.create({
    data: { kode: '2', name: 'Pelaksanaan Pembangunan Desa' },
  })

  const kegiatan1 = await prisma.kegiatan.create({
    data: { kode: '1.1', name: 'Penyediaan Penghasilan Tetap', bidangId: bidangPem.id },
  })
  const kegiatan2 = await prisma.kegiatan.create({
    data: { kode: '2.1', name: 'Pembangunan Jalan Desa', bidangId: bidangPembangunan.id },
  })
  const kegiatans = [kegiatan1, kegiatan2]

  // 6. Seed Pendapatan (Master Anggaran)
  const pendapatanList = []
  for (let i = 0; i < 5; i++) {
    const isTransfer = i < 3
    const pend = await prisma.pendapatan.create({
      data: {
        apbdesId: apbdes.id,
        kategoriId: isTransfer ? katPendTransfer.id : katPendAsli.id,
        sumberDanaId: faker.helpers.arrayElement(sumberDanas).id,
        uraian: isTransfer ? `Pencairan Dana Tahap ${i+1}` : `Pendapatan Usaha Desa ${i+1}`,
        anggaran: faker.number.int({ min: 100, max: 500 }) * 1000000,
        realisasi: 0, // Will be accumulated
      },
    })
    pendapatanList.push(pend)
  }

  // 7. Seed Belanja (Master Anggaran)
  const belanjaList = []
  for (let i = 0; i < 10; i++) {
    const bel = await prisma.belanja.create({
      data: {
        apbdesId: apbdes.id,
        kegiatanId: faker.helpers.arrayElement(kegiatans).id,
        kategoriId: faker.helpers.arrayElement(katsBelanja).id,
        sumberDanaId: faker.helpers.arrayElement(sumberDanas).id,
        uraian: `Pembayaran Belanja Kegiatan ${faker.commerce.productName()}`,
        anggaran: faker.number.int({ min: 50, max: 200 }) * 1000000,
        realisasi: 0, // Will be accumulated
      },
    })
    belanjaList.push(bel)
  }

  console.log('Master Budgets created. Generating 100 transactions...')

  // 8. Generate 100 Transactions (30 Pendapatan, 70 Belanja)
  let totalRealisasiPendapatan = {}
  let totalRealisasiBelanja = {}
  
  const statuses = ['APPROVED', 'APPROVED', 'APPROVED', 'PENDING', 'REJECTED']

  for (let i = 0; i < 100; i++) {
    const isPendapatan = i < 30
    const status = faker.helpers.arrayElement(statuses)
    const tanggal = faker.date.recent({ days: 180 })
    
    if (isPendapatan) {
      const pend = faker.helpers.arrayElement(pendapatanList)
      const maxJumlah = pend.anggaran / 2
      const jumlah = faker.number.int({ min: 1, max: Math.floor(maxJumlah / 1000000) }) * 1000000
      
      const tr = await prisma.transaksiPendapatan.create({
        data: {
          pendapatanId: pend.id,
          tanggal: tanggal,
          jumlah: jumlah,
          keterangan: `Setoran ${pend.uraian} - ${faker.company.name()}`,
          status: status,
          createdBy: faker.helpers.arrayElement([user.id, normalUser.id]),
        }
      })

      if (status === 'APPROVED') {
        totalRealisasiPendapatan[pend.id] = (totalRealisasiPendapatan[pend.id] || 0) + jumlah
      }

      await prisma.logAktivitas.create({
        data: {
          userId: tr.createdBy,
          action: 'CREATE',
          entity: 'TransaksiPendapatan',
          entityId: tr.id,
          details: JSON.stringify({ jumlah: tr.jumlah, status: tr.status }),
          createdAt: tanggal
        }
      })
    } else {
      const bel = faker.helpers.arrayElement(belanjaList)
      const maxJumlah = bel.anggaran / 3
      const jumlah = faker.number.int({ min: 1, max: Math.floor(maxJumlah / 1000000) }) * 1000000
      
      const tr = await prisma.transaksiBelanja.create({
        data: {
          belanjaId: bel.id,
          tanggal: tanggal,
          jumlah: jumlah,
          penerima: faker.person.fullName(),
          keterangan: `Pembayaran ${faker.commerce.productMaterial()}`,
          status: status,
          createdBy: faker.helpers.arrayElement([user.id, normalUser.id]),
        }
      })

      if (status === 'APPROVED') {
        totalRealisasiBelanja[bel.id] = (totalRealisasiBelanja[bel.id] || 0) + jumlah
      }

      await prisma.logAktivitas.create({
        data: {
          userId: tr.createdBy,
          action: 'CREATE',
          entity: 'TransaksiBelanja',
          entityId: tr.id,
          details: JSON.stringify({ jumlah: tr.jumlah, status: tr.status }),
          createdAt: tanggal
        }
      })
    }
  }

  // 9. Update Realisasi values on master data
  console.log('Updating accumulated realisasi...')
  for (const [id, realisasi] of Object.entries(totalRealisasiPendapatan)) {
    await prisma.pendapatan.update({
      where: { id },
      data: { realisasi }
    })
  }
  for (const [id, realisasi] of Object.entries(totalRealisasiBelanja)) {
    await prisma.belanja.update({
      where: { id },
      data: { realisasi }
    })
  }

  console.log('Seeding finished successfully! 100 transactions inserted.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
