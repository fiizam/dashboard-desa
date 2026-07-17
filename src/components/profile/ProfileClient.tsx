"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Shield, Mail, User, MapPin, Calendar, Edit2, KeyRound, Loader2, Save, X, Camera } from 'lucide-react'
import { updateProfile, updateProfilePassword } from '@/server/actions/profile'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  alamat: z.string().optional().nullable(),
  desaId: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
})

const passwordSchema = z.object({
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export function ProfileClient({ user, desas }: { user: any, desas: any[] }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      alamat: user.alamat || '',
      desaId: user.desaId || '',
      avatarUrl: user.avatarUrl || '',
    }
  })

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passErrors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  })

  const formAvatarUrl = watch('avatarUrl')
  const displayAvatar = isEditing ? formAvatarUrl : user.avatarUrl

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setValue('avatarUrl', base64String, { shouldDirty: true })
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      const res = await updateProfile(data)
      if (res.success) {
        setIsEditing(false)
        toast.success("Profil berhasil diperbarui")
        router.refresh()
      } else if (res.error) {
        toast.error(res.error)
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan profil")
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsSubmitting(true)
    try {
      const res = await updateProfilePassword(data.password)
      if (res.success) {
        setIsResetPassword(false)
        toast.success("Password berhasil diubah")
      } else if (res.error) {
        toast.error(res.error)
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Detail Profil</h1>
        {!isEditing && !isResetPassword && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-sm font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit Profil
            </button>
            <button 
              onClick={() => setIsResetPassword(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl text-sm font-medium transition-colors"
            >
              <KeyRound className="w-4 h-4" /> Ganti Password
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm relative">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-primary w-full relative">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px]" />
        </div>
        
        <div className="px-6 pb-8 sm:px-10">
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 sm:-mt-16 mb-8">
            <div className="relative group">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg, image/webp" 
                onChange={handleFileChange} 
              />
              <div 
                onClick={() => isEditing && fileInputRef.current?.click()}
                className={`relative rounded-2xl border-4 border-card shadow-lg bg-card overflow-hidden w-24 h-24 sm:w-32 sm:h-32 ${isEditing ? 'cursor-pointer' : ''}`}
              >
                {displayAvatar ? (
                  <Image 
                    src={displayAvatar} 
                    alt={user.name} 
                    width={128} 
                    height={128} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold text-4xl">
                    {user.name.charAt(0)}
                  </div>
                )}

                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
                    <span className="text-[10px] sm:text-xs font-medium">Ubah Foto</span>
                  </div>
                )}
              </div>
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

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmitProfile)} className="bg-secondary/20 p-6 rounded-2xl border border-border/50">
              <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
                <h3 className="font-semibold text-lg">Edit Profil</h3>
                <button type="button" onClick={() => {
                  setIsEditing(false)
                  setValue('avatarUrl', user.avatarUrl)
                }} className="p-2 hover:bg-secondary rounded-full">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Lengkap</label>
                  <input {...register('name')} className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm" />
                  {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username (Hanya Tampilan)</label>
                  <input disabled value={`@${user.username}`} className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm opacity-60 cursor-not-allowed" />
                  <p className="text-xs text-muted-foreground">Username untuk login tidak dapat diubah.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input {...register('email')} className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm" />
                  {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Alamat</label>
                  <input {...register('alamat')} className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm" placeholder="Contoh: Jl. Merdeka No 1" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Desa</label>
                  <select {...register('desaId')} className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm">
                    <option value="">-- Tidak Memilih Desa --</option>
                    {desas.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : isResetPassword ? (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="bg-secondary/20 p-6 rounded-2xl border border-border/50 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
                <h3 className="font-semibold text-lg">Ganti Password</h3>
                <button type="button" onClick={() => setIsResetPassword(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password Baru</label>
                  <input type="password" {...registerPassword('password')} className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm" placeholder="••••••••" />
                  {passErrors.password && <p className="text-xs text-rose-500">{passErrors.password.message}</p>}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Password
                </button>
              </div>
            </form>
          ) : (
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
                <h3 className="font-semibold text-lg border-b border-border/50 pb-2">Informasi Lainnya</h3>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                    <p className="font-semibold">{user.alamat || '-'}</p>
                  </div>
                </div>

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
                        <p className="text-sm font-medium text-muted-foreground">Kecamatan / Kabupaten</p>
                        <p className="font-semibold">{user.desa.kecamatan.name} / {user.desa.kecamatan.kabupaten.name}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-secondary/30 text-center">
                    <p className="text-muted-foreground text-sm">Belum ada informasi unit kerja desa.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
