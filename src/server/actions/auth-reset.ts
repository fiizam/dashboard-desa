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
      from: `"DesaSync Security" <${process.env.SMTP_USER || 'noreply@desa.id'}>`,
      to: user.email,
      subject: 'Reset Password Akun DesaSync Anda',
      text: `Halo ${user.name},\n\nKami menerima permintaan untuk mereset kata sandi akun Anda. Silakan kunjungi tautan berikut untuk mengatur kata sandi baru: \n\n${resetUrl}\n\nTautan ini hanya berlaku selama 1 jam.\nJika Anda tidak meminta reset kata sandi, abaikan email ini.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
            .wrapper { width: 100%; background-color: #f4f7f6; padding: 40px 0; }
            .main { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
            .header { background-color: #2563eb; padding: 40px 20px; text-align: center; }
            .logo-container { width: 60px; height: 60px; margin: 0 auto 15px auto; background-color: #ffffff; border-radius: 50%; display: table; }
            .logo-text { display: table-cell; vertical-align: middle; font-size: 28px; font-weight: bold; color: #2563eb; }
            .title { color: #ffffff; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 0.5px; }
            .subtitle { color: #bfdbfe; font-size: 14px; margin-top: 8px; }
            .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
            .greeting { font-size: 20px; font-weight: bold; color: #1f2937; margin-top: 0; }
            .message { font-size: 15px; margin-bottom: 25px; }
            .button-container { text-align: center; margin: 35px 0; }
            .button { background-color: #2563eb; color: #ffffff !important; padding: 14px 32px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; }
            .security-notice { background-color: #f8fafc; border-left: 4px solid #94a3b8; padding: 15px 20px; margin-top: 30px; }
            .security-notice p { margin: 0; font-size: 13px; color: #64748b; }
            .footer { background-color: #f1f5f9; padding: 25px 30px; text-align: center; font-size: 12px; color: #64748b; }
            .link-raw { font-size: 11px; color: #94a3b8; word-break: break-all; margin-top: 20px; display: block; text-align: center; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="main">
              <div class="header">
                <div class="logo-container">
                  <span class="logo-text">D</span>
                </div>
                <h1 class="title">DesaSync</h1>
                <div class="subtitle">Sistem Informasi Keuangan Desa</div>
              </div>
              <div class="content">
                <p class="greeting">Halo ${user.name},</p>
                <p class="message">Kami menerima permintaan untuk mengatur ulang kata sandi <i>(reset password)</i> akun Anda di platform DesaSync.</p>
                <p class="message">Silakan klik tombol di bawah ini untuk membuat kata sandi yang baru. Tautan ini hanya berlaku selama <strong>1 jam</strong>.</p>
                
                <div class="button-container">
                  <a href="${resetUrl}" class="button">Reset Kata Sandi</a>
                </div>
                
                <div class="security-notice">
                  <p><strong>Abaikan email ini</strong> jika Anda tidak pernah meminta pengaturan ulang kata sandi. Keamanan akun Anda tetap terjaga dan kata sandi Anda tidak akan berubah.</p>
                </div>
                
                <a href="${resetUrl}" class="link-raw">${resetUrl}</a>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} DesaSync Enterprise.<br>Email ini dikirim secara otomatis, mohon tidak membalas.</p>
              </div>
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
