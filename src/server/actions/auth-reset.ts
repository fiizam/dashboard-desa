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
      from: `"DesaSync Enterprise" <${process.env.SMTP_USER || 'noreply@desa.id'}>`,
      to: user.email,
      replyTo: process.env.SMTP_USER || 'noreply@desa.id',
      subject: '🔒 Reset Password Akun DesaSync Anda',
      headers: {
        'X-Entity-Ref-ID': crypto.randomBytes(16).toString('hex'),
        'Priority': 'High',
        'Importance': 'High'
      },
      text: `Halo ${user.name},\n\nKami menerima permintaan untuk mereset kata sandi akun Anda. Silakan kunjungi tautan berikut untuk mengatur kata sandi baru: \n\n${resetUrl}\n\nTautan ini hanya berlaku selama 1 jam.\nJika Anda tidak meminta reset kata sandi, abaikan email ini.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 60px; }
            .main { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08); border: 1px solid #f1f5f9; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); padding: 50px 40px; text-align: center; position: relative; overflow: hidden; }
            .header::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%); transform: rotate(30deg); pointer-events: none; }
            .logo-box { background: rgba(255,255,255,0.2); width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: white; backdrop-filter: blur(10px); }
            .title { color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px; line-height: 1.2; }
            .subtitle { color: rgba(255,255,255,0.9); font-size: 15px; margin-top: 10px; font-weight: 500; }
            .content { padding: 45px 40px; color: #334155; line-height: 1.7; }
            .greeting { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
            .message { font-size: 16px; margin: 0 0 24px 0; color: #475569; }
            .button-container { text-align: center; margin: 40px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%); color: #ffffff; padding: 16px 36px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4); transition: transform 0.2s, box-shadow 0.2s; }
            .button:hover { transform: translateY(-2px); box-shadow: 0 12px 30px -5px rgba(59, 130, 246, 0.5); }
            .divider { height: 1px; background-color: #e2e8f0; margin: 40px 0; }
            .security-notice { display: flex; align-items: flex-start; gap: 16px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .security-notice p { margin: 0; font-size: 14px; color: #64748b; line-height: 1.5; text-align: left; }
            .security-notice strong { color: #334155; display: block; margin-bottom: 4px; }
            .footer { background: #f1f5f9; padding: 30px 40px; text-align: center; font-size: 13px; color: #94a3b8; }
            .footer p { margin: 5px 0; }
            .link-raw { font-size: 12px; color: #3b82f6; word-break: break-all; margin-top: 24px; text-align: center; display: block; text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="main">
              <div class="header">
                <div class="logo-box">D</div>
                <h1 class="title">DesaSync</h1>
                <div class="subtitle">Sistem Informasi Keuangan Desa</div>
              </div>
              <div class="content">
                <p class="greeting">Halo ${user.name},</p>
                <p class="message">Kami menerima permintaan dari perangkat Anda untuk mengatur ulang kata sandi <i>(reset password)</i> pada akun DesaSync.</p>
                <p class="message">Untuk menjaga keamanan data keuangan desa, silakan klik tombol di bawah ini untuk membuat kata sandi yang baru. <b>Tautan ini akan kedaluwarsa secara otomatis dalam waktu 1 jam.</b></p>
                
                <div class="button-container">
                  <a href="${resetUrl}" class="button">Atur Ulang Kata Sandi</a>
                </div>
                
                <div class="security-notice">
                  <div>
                    <p><strong>Bukan Anda yang meminta?</strong></p>
                    <p>Jika Anda tidak pernah merasa meminta pengaturan ulang kata sandi, abaikan email ini dengan aman. Sistem keamanan kami akan memastikan akun Anda tetap terlindungi.</p>
                  </div>
                </div>
                
                <a href="${resetUrl}" class="link-raw">${resetUrl}</a>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} DesaSync Enterprise. Hak Cipta Dilindungi.</p>
                <p>Pesan ini dihasilkan secara otomatis oleh sistem keamanan kami. Mohon untuk tidak membalas email ini.</p>
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
