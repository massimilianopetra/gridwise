import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configura il trasportatore con Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Host SMTP 
  port: 587, // Porta SMTP (STARTTLS)
  secure: false, // Usa TLS (false per STARTTLS)
  auth: {
    user: process.env.EMAIL_API_KEY, // Public Key di Mailjet
    pass: process.env.EMAIL_SECRET_KEY, // Private Key di Mailjet
  },
});

// Esporta il metodo POST per gestire le richieste
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, subject, text } = body;

    // Validazione dei campi richiesti
    if (!email || !subject || !text) {
        console.log(`email: ${email} subject:${subject} text: ${text}`)
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Invio dell'email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM, // Mittente
      to: process.env.TEST_EMAIL, // Destinatario (usiamo il campo "email" dal body)
      subject: subject, // Oggetto
      text: text, // Corpo del messaggio
    });

    return NextResponse.json({
      message: 'Email sent successfully',
      info,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error sending email', details: "" },
      { status: 500 }
    );
  }
}
