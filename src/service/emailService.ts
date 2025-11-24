import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { REQUIRED_DOCUMENTS } from '../constant/RequiredDocumentsConst';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function sendWelcomeEmail(to: string, id: string, name: string) {
    const registrationUrl = `${process.env.REGISTRATION_URL || 'http://localhost:3000/registration'}/${id}`;
    const documentList = REQUIRED_DOCUMENTS.map((doc, idx) => `${idx + 1}. ${doc}`).join('<br>');
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Welcome to Mark International',
        html: `
            <h2>Welcome to Mark International!</h2>
            <p>Dear <b>${name}</b>,</p>
            <p>Your ID: <b>${id}</b></p>
            <p>Please complete your registration using the following link:</p>
            <a href="${registrationUrl}">${registrationUrl}</a>
            <p>After registration, please upload the following documents:</p>
            <p>${documentList}</p>
        `,
    };
    console.log(`[EMAIL] Sending welcome email to: ${to}`);
    try {
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Welcome email sent successfully to: ${to}`);
    } catch (error) {
        console.error(`[EMAIL] Failed to send welcome email to: ${to}`, error);
    }
}
