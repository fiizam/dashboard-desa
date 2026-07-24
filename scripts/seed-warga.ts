const { PrismaClient } = require('../src/generated/client')

const prisma = new PrismaClient()

// Arrays of realistic Indonesian names
const firstNamesM = ['Budi', 'Agus', 'Hendra', 'Dedi', 'Ahmad', 'Reza', 'Rizky', 'Wahyu', 'Eko', 'Rahmat', 'Fajar', 'Irwan', 'Rudi', 'Andi', 'Bambang', 'Yudi', 'Haryono', 'Dwi', 'Tri', 'Slamet']
const firstNamesF = ['Siti', 'Ayu', 'Sri', 'Putri', 'Dewi', 'Nur', 'Rini', 'Dina', 'Sari', 'Indah', 'Fitri', 'Ratna', 'Lestari', 'Eka', 'Maya', 'Nita', 'Wati', 'Tari', 'Desi', 'Rina']
const lastNames = ['Santoso', 'Wijaya', 'Kusuma', 'Pratama', 'Hidayat', 'Saputra', 'Setiawan', 'Nugroho', 'Wibowo', 'Firmansyah', 'Syahputra', 'Mahendra', 'Gunawan', 'Hartono', 'Purnama']

function getRandomName(gender) {
  const fNames = gender === 'Laki-laki' ? firstNamesM : firstNamesF
  const first = fNames[Math.floor(Math.random() * fNames.length)]
  const hasLastName = Math.random() > 0.3 // 70% have last names
  if (hasLastName) {
    const last = lastNames[Math.floor(Math.random() * lastNames.length)]
    return `${first} ${last}`
  }
  return first
}

async function main() {
  console.log('Menghapus data kependudukan lama (reset)...')
  await prisma.warga.deleteMany({})
  await prisma.keluarga.deleteMany({})

  console.log('Memulai injeksi 78 data Warga dummy yang realistis...')

  // 1. Dapatkan Desa
  const desa = await prisma.desa.findFirst()
  if (!desa) {
    console.error('Data Desa tidak ditemukan!')
    return
  }

  // 2. Buat 20 Keluarga (Kartu Keluarga)
  const keluargaData = []
  for (let i = 1; i <= 20; i++) {
    // Generate realistic KK format: 320101 (Prov/Kab/Kec) + DDMMYY + XXXX
    const nomorKk = `320101${Math.floor(100000 + Math.random() * 900000)}${Math.floor(1000 + Math.random() * 9000)}`
    
    // Distribute among RT 01 to RT 05
    const rtList = ['001', '002', '003', '004', '005']
    const rt = rtList[Math.floor(Math.random() * rtList.length)]

    // Assign realistic head of family name
    const headGender = Math.random() > 0.1 ? 'Laki-laki' : 'Perempuan' // 90% Male head
    const kepalaKeluarga = getRandomName(headGender)

    keluargaData.push({
      nomorKk,
      kepalaKeluarga,
      alamat: `Jl. Melati Blok ${String.fromCharCode(65 + Math.floor(Math.random() * 5))} No. ${Math.floor(Math.random() * 100) + 1}`,
      rt,
      rw: '006',
      desaId: desa.id
    })
  }

  await prisma.keluarga.createMany({
    data: keluargaData,
    skipDuplicates: true
  })

  const keluargas = await prisma.keluarga.findMany({ take: 20, orderBy: { createdAt: 'desc' } })

  // 3. Buat 78 Warga
  let wargaCreated = 0
  const jobs = ['Karyawan Swasta', 'PNS', 'Wiraswasta', 'Petani', 'Pelajar/Mahasiswa', 'Mengurus Rumah Tangga', 'Buruh Harian Lepas', 'Belum/Tidak Bekerja', 'Pedagang']
  const educations = ['Tamat SD/Sederajat', 'SLTP/Sederajat', 'SLTA/Sederajat', 'Diploma IV/Strata I', 'Diploma III/Sarmud', 'Belum Tamat SD/Sederajat', 'Tidak/Belum Sekolah']
  const religions = ['Islam', 'Kristen', 'Katholik', 'Hindu', 'Budha', 'Konghucu']

  // Head of families first (20)
  for (let i = 0; i < keluargas.length; i++) {
    const k = keluargas[i]
    // guess gender from name (simple heuristic: if in firstNamesF, it's female)
    const isFemale = firstNamesF.some(f => k.kepalaKeluarga.includes(f))
    const jenisKelamin = isFemale ? 'Perempuan' : 'Laki-laki'
    
    // NIK logic: 320101 + DDMMYY (if female DD+40) + XXXX
    const birthYear = 1960 + Math.floor(Math.random() * 30) // 1960-1989
    const birthMonth = Math.floor(Math.random() * 12) + 1
    const birthDayRaw = Math.floor(Math.random() * 28) + 1
    
    let dd = isFemale ? birthDayRaw + 40 : birthDayRaw
    let ddStr = dd.toString().padStart(2, '0')
    let mmStr = birthMonth.toString().padStart(2, '0')
    let yyStr = birthYear.toString().slice(-2)

    const nik = `320101${ddStr}${mmStr}${yyStr}${Math.floor(1000 + Math.random() * 9000)}`
    
    await prisma.warga.create({
      data: {
        nik,
        nama: k.kepalaKeluarga,
        tempatLahir: 'Bandung',
        tanggalLahir: new Date(`${birthYear}-${mmStr}-${birthDayRaw.toString().padStart(2, '0')}T00:00:00Z`),
        jenisKelamin,
        agama: 'Islam', // Mostly Islam for realistic data
        pendidikan: educations[Math.floor(Math.random() * 4)], // Higher chance of higher education
        pekerjaan: isFemale ? 'Mengurus Rumah Tangga' : jobs[Math.floor(Math.random() * 4)],
        statusPerkawinan: 'Kawin',
        statusKeluarga: 'Kepala Keluarga',
        keluargaId: k.id
      }
    })
    wargaCreated++
  }

  // Create remaining 58 citizens (wives, kids)
  for (let i = 0; i < 58; i++) {
    const k = keluargas[i % keluargas.length] // distribute among families
    
    // Decide if it's a wife or a child. Each family mostly gets 1 wife.
    // Let's randomize, but bias towards 'Anak'
    const isWife = Math.random() > 0.7 
    
    let statusKeluarga = 'Anak'
    let jenisKelamin = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan'
    let statusPerkawinan = 'Belum Kawin'
    let birthYear, job, edu

    if (isWife) {
      statusKeluarga = 'Istri'
      jenisKelamin = 'Perempuan'
      statusPerkawinan = 'Kawin'
      birthYear = 1965 + Math.floor(Math.random() * 25)
      job = 'Mengurus Rumah Tangga'
      edu = educations[Math.floor(Math.random() * 3) + 1]
    } else {
      birthYear = 1995 + Math.floor(Math.random() * 28)
      if (birthYear > 2005) {
        job = 'Pelajar/Mahasiswa'
        edu = 'Belum Tamat SD/Sederajat'
      } else {
        job = jobs[Math.floor(Math.random() * jobs.length)]
        edu = educations[Math.floor(Math.random() * educations.length)]
      }
    }

    const birthMonth = Math.floor(Math.random() * 12) + 1
    const birthDayRaw = Math.floor(Math.random() * 28) + 1
    
    let dd = jenisKelamin === 'Perempuan' ? birthDayRaw + 40 : birthDayRaw
    let ddStr = dd.toString().padStart(2, '0')
    let mmStr = birthMonth.toString().padStart(2, '0')
    let yyStr = birthYear.toString().slice(-2)

    const nik = `320101${ddStr}${mmStr}${yyStr}${Math.floor(1000 + Math.random() * 9000)}`

    await prisma.warga.create({
      data: {
        nik,
        nama: getRandomName(jenisKelamin),
        tempatLahir: 'Bandung',
        tanggalLahir: new Date(`${birthYear}-${mmStr}-${birthDayRaw.toString().padStart(2, '0')}T00:00:00Z`),
        jenisKelamin,
        agama: 'Islam',
        pendidikan: edu,
        pekerjaan: job,
        statusPerkawinan,
        statusKeluarga,
        keluargaId: k.id
      }
    })
    wargaCreated++
  }

  console.log(`Berhasil membuat ${keluargas.length} Keluarga.`)
  console.log(`Berhasil membuat ${wargaCreated} Warga secara acak dengan profil sangat nyata.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
