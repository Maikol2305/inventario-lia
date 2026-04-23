'use server'

import { mockUsers } from "@/lib/db/mock-data";
import { resend } from "@/lib/resend";
import { revalidatePath } from "next/cache";

export async function registerUser(data: {
  name: string;
  email: string;
  role?: string;
}) {
  try {
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // SAVE TO MOCK DB
    mockUsers.push({
      id: mockUsers.length + 1,
      name: data.name,
      email: data.email,
      password: tempPassword,
      role: data.role || 'user',
    });

    // TRY TO SEND EMAIL (MOCK VERSION)
    try {
      await resend.emails.send({
        from: 'LÍA Inventario <onboarding@resend.dev>',
        to: data.email,
        subject: 'Tus credenciales para LÍA Inventario',
        html: `<h1>¡Bienvenido a LÍA!</h1><p>Contraseña Temporal: ${tempPassword}</p>`,
      });
    } catch (e) {
      console.warn("Resend failed or not configured, but user was created in mock DB.");
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al registrar usuario" };
  }
}
