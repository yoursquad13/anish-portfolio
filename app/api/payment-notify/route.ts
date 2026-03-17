import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, method, amount, currency, walletName } = await request.json();

    const transporter = nodemailer.createTransport({
      host: 'smtp.titan.email',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'no-reply@ane.sh',
        pass: process.env.SMTP_PASSWORD || '',
      },
    });

    const methodLabel = method === 'crypto' ? `Crypto (${walletName || 'N/A'})` : 'Stripe (Card/Apple/Google Pay)';

    const mailOptions = {
      from: `"Payment Notification" <no-reply@ane.sh>`,
      to: 'anishkhatri13@gmail.com',
      replyTo: email,
      subject: `💰 Payment Attempt from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 550px; margin: auto; padding: 30px; background: #0d0d14; color: #e0e0e8; border-radius: 16px; border: 1px solid #1a1a2e;">
          <h2 style="color: #00ff88; margin-top: 0;">New Payment Attempt</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #888;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Method</td><td style="padding: 8px 0; font-weight: bold;">${methodLabel}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Amount</td><td style="padding: 8px 0; font-weight: bold; color: #00ff88;">${currency || 'USD'} ${amount || 'N/A'}</td></tr>
          </table>
          <hr style="border: 1px solid #1a1a2e; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; margin: 0;">Sent from your Portfolio Payment System</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment notification error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
  }
}
