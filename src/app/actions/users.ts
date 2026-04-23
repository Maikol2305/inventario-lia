'use server'

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { resend } from "@/lib/resend";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function registerUser(data: {
  name: string;
  email: string;
  role?: string;
}) {
  try {
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Save to DB
    await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user',
    });

    // Send email via Resend
    await resend.emails.send({
      from: 'LÍA Inventario <onboarding@resend.dev>',
      to: data.email,
      subject: 'Tus credenciales para LÍA Inventario',
      html: `
        <h1>¡Bienvenido a LÍA!</h1>
        <p>Hola ${data.name}, se ha creado tu cuenta en el Laboratorio de Informática Aplicada.</p>
        <p>Tus credenciales de acceso son:</p>
        <ul>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Contraseña Temporal:</strong> ${tempPassword}</li>
        </ul>
        <p>Por favor, cambia tu contraseña después de iniciar sesión.</p>
      `,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error: "Error al registrar usuario o enviar correo" };
  }
}
