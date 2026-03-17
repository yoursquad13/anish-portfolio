import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    const transporter = nodemailer.createTransport({
      host: 'smtp.titan.email',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'no-reply@ane.sh',
        pass: process.env.SMTP_PASSWORD || '',
      },
    });

    const mailOptions = {
      from: `"${name}" <no-reply@ane.sh>`, // Sender address
      to: 'anishkhatri13@gmail.com',       // List of receivers
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      text: message,
      html: `
        <h3>New Message from Portfolio Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
