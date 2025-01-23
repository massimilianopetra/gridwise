import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { setKeyValue } from '@/app/lib/actions';

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
    const { email } = body;

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const message = `This is your activation code: ${newCode} for emai ${email} at OpenTradeNet`;
    const subject = `Activation Code ${newCode}`;

    console.log(`*** send activation code ***`);
    console.log(`email: ${email} subject:${subject} text: ${message}`);

    await setKeyValue(email,newCode,600);
  
    // Validazione dei campi richiesti
    if (!email) {
      
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Invio dell'email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM, // Mittente
      to: email, // Destinatario (usiamo il campo "email" dal body)
      subject: subject, // Oggetto
      text: message, // Corpo del messaggio
    });

    return NextResponse.json({
      message: 'Activation code sent successfully',
      info,
    });

  } catch (error) {
    console.error('Error sending activation code:', error);
    return NextResponse.json(
      { error: 'Error sending activation code', details: "" },
      { status: 500 }
    );
  }
}
