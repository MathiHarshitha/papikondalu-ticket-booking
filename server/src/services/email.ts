import { logger } from '../config/logger'

const FROM_NAME = 'Aswini Godavari Travel & Tourism'
const FROM_EMAIL = process.env.EMAIL_FROM || 'bookings@papikondalutourism.com'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

async function send(to: string, subject: string, html: string): Promise<void> {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    })
    if (!response.ok) {
      const err = await response.text()
      throw new Error(err)
    }
    logger.info('Email sent', { to, subject })
  } catch (err) {
    logger.error('Email send failed', { to, subject, err })
  }
}

const LOGO_URL = 'https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755418849/AG_LOGO_2_xfznol.png'

function emailShell(body: string): string {
  return `
    <div style="background:#f4f6f4;padding:32px 16px;font-family:Arial,sans-serif">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <div style="background:#123B56;padding:20px 28px;display:flex;align-items:center;gap:14px">
          <img src="${LOGO_URL}" alt="Aswini Godavari Travel Logo" width="44" height="44" style="border-radius:6px;object-fit:contain;background:#fff;padding:3px">
          <div>
            <div style="color:#ffffff;font-size:15px;font-weight:bold;line-height:1.2">Aswini Godavari</div>
            <div style="color:#a8c8d8;font-size:12px">Travel &amp; Tourism</div>
          </div>
        </div>
        <div style="padding:32px 32px 24px;color:#333333;font-size:14px;line-height:1.6">
          ${body}
        </div>
        <div style="background:#f0f4f6;padding:14px 32px;font-size:11px;color:#999999;text-align:center;line-height:1.5">
          &copy; ${new Date().getFullYear()} Aswini Godavari Travel &amp; Tourism &middot; Bhadrachalam, Telangana<br>
          aswinigodavari@gmail.com
        </div>
      </div>
    </div>
  `
}

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/verify-email?token=${token}`
  await send(to, 'Verify your email — Aswini Godavari Travel & Tourism', emailShell(`
    <h2 style="color:#123B56;font-size:20px;margin-bottom:12px">Welcome, ${name}!</h2>
    <p>Thanks for registering. Please verify your email address to activate your account.</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${link}" style="background:#F29B38;color:#ffffff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">Verify Email</a>
    </p>
    <p style="color:#888888;font-size:12px">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
  `))
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const link = `${CLIENT_URL}/reset-password?token=${token}`
  await send(to, 'Reset your password — Aswini Godavari Travel & Tourism', emailShell(`
    <h2 style="color:#123B56;font-size:20px;margin-bottom:12px">Password Reset Request</h2>
    <p>Hi ${name}, we received a request to reset your password.</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${link}" style="background:#F29B38;color:#ffffff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">Reset Password</a>
    </p>
    <p style="color:#888888;font-size:12px">This link expires in 1 hour. If you didn't request a password reset, please ignore this email — your password will not change.</p>
  `))
}

export interface BookingEmailData {
  to: string
  name: string
  bookingRef: string
  packageTitle: string
  departureDate: Date
  boardingLocation: string
  adultCount: number
  childCount: number
  total: number
}

export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<void> {
  const { to, name, bookingRef, packageTitle, departureDate, boardingLocation, adultCount, childCount, total } = data
  const formattedDate = new Date(departureDate).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  const passengers = adultCount + childCount
  await send(to, `Booking Confirmed: ${bookingRef} — Aswini Godavari Travel & Tourism`, emailShell(`
    <h2 style="color:#123B56;font-size:20px;margin-bottom:12px">Booking Confirmed!</h2>
    <p>Hi ${name}, your booking is confirmed. Here are your details:</p>
    <div style="background:#e8f0f5;border:1px solid #b0c8d9;border-radius:6px;padding:14px;text-align:center;margin:16px 0 20px;font-size:20px;font-weight:bold;letter-spacing:0.06em;color:#123B56;font-family:monospace">
      ${bookingRef}
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px">
      <tr style="background:#f5f7f8"><td style="padding:10px 12px;font-weight:bold;color:#444;width:130px">Package</td><td style="padding:10px 12px">${packageTitle}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#444">Date</td><td style="padding:10px 12px">${formattedDate}</td></tr>
      <tr style="background:#f5f7f8"><td style="padding:10px 12px;font-weight:bold;color:#444">Boarding</td><td style="padding:10px 12px">${boardingLocation}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#444">Passengers</td><td style="padding:10px 12px">${adultCount} Adult${adultCount !== 1 ? 's' : ''}${childCount > 0 ? `, ${childCount} Child${childCount !== 1 ? 'ren' : ''}` : ''} (${passengers} total)</td></tr>
      <tr style="background:#f5f7f8"><td style="padding:10px 12px;font-weight:bold;color:#444">Amount Paid</td><td style="padding:10px 12px;color:#168C8C;font-weight:bold">&#8377;${total.toLocaleString('en-IN')}</td></tr>
    </table>
    <p>Please carry a valid photo ID on the day of your trip. Show this booking reference at the boarding point.</p>
    <p style="text-align:center;margin:24px 0">
      <a href="${CLIENT_URL}/account/bookings" style="background:#F29B38;color:#ffffff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">View My Booking</a>
    </p>
    <p style="color:#888888;font-size:12px;margin-top:16px">For any queries, contact us at aswinigodavari@gmail.com</p>
  `))
}

export async function sendRefundApprovedEmail(to: string, name: string, bookingRef: string, amount: number): Promise<void> {
  await send(to, `Refund Approved: ${bookingRef} — Aswini Godavari Travel & Tourism`, emailShell(`
    <h2 style="color:#123B56;font-size:20px;margin-bottom:12px">Refund Approved</h2>
    <p>Hi ${name}, your refund request for booking <strong>${bookingRef}</strong> has been approved.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0 20px;font-size:13px">
      <tr style="background:#f5f7f8"><td style="padding:10px 12px;font-weight:bold;color:#444;width:130px">Booking Ref</td><td style="padding:10px 12px">${bookingRef}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#444">Refund Amount</td><td style="padding:10px 12px;color:#168C8C;font-weight:bold">&#8377;${amount.toLocaleString('en-IN')}</td></tr>
      <tr style="background:#f5f7f8"><td style="padding:10px 12px;font-weight:bold;color:#444">Timeline</td><td style="padding:10px 12px">5–7 business days</td></tr>
    </table>
    <p>The amount will be credited to your original payment method within 5–7 business days.</p>
    <p style="text-align:center;margin:24px 0">
      <a href="${CLIENT_URL}/account/refunds" style="background:#F29B38;color:#ffffff;padding:13px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">View Refund Status</a>
    </p>
    <p style="color:#888888;font-size:12px;margin-top:16px">For any queries, contact us at aswinigodavari@gmail.com</p>
  `))
}
