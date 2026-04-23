'use server'

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { mockProducts } from "@/lib/db/mock-data";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// SEGURIDAD PARA EL BUILD DE VERCEL
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
const hasDbUrl = !!process.env.DATABASE_URL;

export async function getProducts() {
  if (isBuild || !hasDbUrl) return mockProducts;
  
  try {
    return await db.select().from(products).orderBy(products.name);
  } catch (e) {
    console.warn("Error de conexión a DB, usando mock data:", e);
    return mockProducts;
  }
}

export async function createProduct(data: any) {
  if (hasDbUrl) {
    await db.insert(products).values(data);
  } else {
    mockProducts.push({ id: Date.now(), ...data, lastUpdated: new Date() });
  }
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateProductQuantity(id: number, newQuantity: number, reason: string) {
  if (hasDbUrl) {
    await db.update(products).set({ quantity: newQuantity }).where(eq(products.id, id));
  } else {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx !== -1) mockProducts[idx].quantity = newQuantity;
  }
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getLowStockAlerts() {
  const all = await getProducts();
  return all.filter((p: any) => p.quantity <= p.minStock);
}

export async function deleteProduct(id: number) {
  if (hasDbUrl) {
    await db.delete(products).where(eq(products.id, id));
  } else {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx !== -1) mockProducts.splice(idx, 1);
  }
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  return { success: true };
}
