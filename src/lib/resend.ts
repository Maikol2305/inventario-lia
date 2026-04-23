import { Resend } from 'resend';

// Clave de respaldo proporcionada para asegurar el funcionamiento inicial
const apiKey = process.env.RESEND_API_KEY || "Maikoljesus15.";
export const resend = new Resend(apiKey);
