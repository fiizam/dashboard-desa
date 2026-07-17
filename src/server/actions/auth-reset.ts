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
      subject: 'Reset Password Akun Anda - Sistem Keuangan Desa',
      text: `Halo ${user.name},\n\nKami menerima permintaan untuk mereset kata sandi akun Anda. Silakan kunjungi tautan berikut untuk mengatur kata sandi baru: \n\n${resetUrl}\n\nTautan ini hanya berlaku selama 1 jam.\nJika Anda tidak meminta reset kata sandi, abaikan email ini.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; }
            .header-title { color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
            .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
            .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-top: 0; }
            .message { font-size: 16px; margin: 20px 0; }
            .button-container { text-align: center; margin: 35px 0; }
            .button { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 32px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
            .warning { font-size: 14px; color: #6b7280; padding: 16px; background: #f9fafb; border-radius: 8px; margin-top: 30px; }
            .footer { background: #f9fafb; padding: 20px 30px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
            .link-raw { font-size: 12px; color: #2563eb; word-break: break-all; margin-top: 20px; text-align: center; display: block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="header-title">Sistem Keuangan Desa</h1>
            </div>
            <div class="content">
              <p class="greeting">Halo ${user.name},</p>
              <p class="message">Kami menerima permintaan dari akun Anda untuk mengatur ulang kata sandi (reset password).</p>
              <p class="message">Untuk menjaga keamanan akun Anda, silakan klik tombol di bawah ini untuk membuat kata sandi yang baru. <b>Tautan ini hanya berlaku selama 1 jam.</b></p>
              
              <div class="button-container">
                <a href="${resetUrl}" class="button">Atur Ulang Kata Sandi</a>
              </div>
              
              <p class="warning">
                <strong>Apakah Anda tidak meminta perubahan kata sandi?</strong><br>
                Anda bisa mengabaikan email ini. Kata sandi Anda akan tetap aman dan tidak akan berubah.
              </p>
              
              <a href="${resetUrl}" class="link-raw">${resetUrl}</a>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Sistem Keuangan Desa. Pesan ini dikirim secara otomatis oleh sistem.
            </div>
          </div>
        </body>
        </html>
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
