"use server"

import prisma from '@/lib/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) {
      // Return success even if user not found for security reasons
      return { success: true, message: 'Jika email terdaftar, tautan reset telah dikirim.' }
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 3600000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires
      }
    })

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: `"Sistem Keuangan Desa" <${process.env.SMTP_USER || 'noreply@desa.id'}>`,
      to: user.email,
      subject: 'Reset Password - Sistem Keuangan Desa',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Reset Password</h2>
          <p>Halo <strong>${user.name}</strong>,</p>
          <p>Kami menerima permintaan untuk mereset kata sandi akun Anda. Silakan klik tombol di bawah ini untuk mengatur kata sandi baru:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px;">Atur Kata Sandi Baru</a>
          <p>Tautan ini hanya berlaku selama 1 jam.</p>
          <p>Jika Anda tidak meminta reset kata sandi, abaikan email ini.</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Pesan ini dikirim secara otomatis oleh sistem.</p>
        </div>
      `
    }

    // In development or if SMTP is not configured, we just log it to prevent crashing
    if (!process.env.SMTP_USER) {
      console.log('--- EMAIL MOCK ---')
      console.log('To:', mailOptions.to)
      console.log('Subject:', mailOptions.subject)
      console.log('Reset URL:', resetUrl)
      console.log('------------------')
    } else {
      await transporter.sendMail(mailOptions)
    }

    return { success: true, message: 'Tautan reset kata sandi telah dikirim ke email Anda.' }
  } catch (error) {
    console.error('Password reset error:', error)
    return { error: 'Gagal mengirim email reset kata sandi. Pastikan konfigurasi SMTP di .env sudah benar.' }
  }
}

export async function resetPassword(password: string, token: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return { error: 'Tautan reset tidak valid atau sudah kedaluwarsa.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    })

    return { success: true, message: 'Kata sandi berhasil diubah! Silakan login.' }
  } catch (error) {
    console.error('Reset password error:', error)
    return { error: 'Terjadi kesalahan sistem.' }
  }
}
