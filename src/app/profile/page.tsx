import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import { Shield, Mail, User, MapPin, Calendar } from 'lucide-react'

export default async function ProfilePage() {
  const session = await getSession()
  const role = session?.role || 'User'
  
  let user = null
  if (session?.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        role: true,
        desa: {
          include: {
            kecamatan: {
              include: {
                kabupaten: {
                  include: {
                    provinsi: true
                  }
                }
              }
            }
          }
        }
      }
    })
  }

  if (!user) {
    return (
      <DashboardLayout userRole={role}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-2">Profil Tidak Ditemukan</h2>
          <p className="text-muted-foreground">Silakan login kembali.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole={role}>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight">Detail Profil</h1>
        
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
          {/* Header Cover */}
          <div className="h-32 bg-gradient-to-r from-primary/80 to-primary w-full relative">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px]" />
          </div>
          
          <div className="px-6 pb-8 sm:px-10">
            {/* Avatar & Basic Info */}
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 mb-8">
              <div className="relative">
                {user.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    width={120} 
                    height={120} 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-card shadow-lg bg-card"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-primary/10 border-4 border-card text-primary flex items-center justify-center font-bold text-4xl shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-card rounded-full" title="Active" />
              </div>
              
              <div className="text-center sm:text-left flex-1 pb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground font-medium text-sm sm:text-base">@{user.username}</p>
              </div>
              
              <div className="pb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  <Shield className="w-4 h-4" />
                  {user.role.name}
                </span>
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Informasi Akun</h3>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nama Lengkap</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tanggal Bergabung</p>
                    <p className="font-semibold">
                      {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(user.createdAt))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Informasi Unit Kerja</h3>
                
                {user.desa ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Desa</p>
                        <p className="font-semibold">{user.desa.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Kecamatan</p>
                        <p className="font-semibold">{user.desa.kecamatan.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Kabupaten</p>
                        <p className="font-semibold">{user.desa.kecamatan.kabupaten.name}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-secondary/30 text-center">
                    <p className="text-muted-foreground text-sm">Belum ada informasi unit kerja.</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
