'use server'

import { db } from "@/lib/db";
import { products, inventoryLog } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    return await db.select().from(products).orderBy(products.name);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function createProduct(data: {
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  minStock: number;
  category?: string;
}) {
  try {
    await db.insert(products).values({
      sku: data.sku,
      name: data.name,
      description: data.description,
      quantity: data.quantity,
      minStock: data.minStock,
      category: data.category,
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProductQuantity(id: number, newQuantity: number, reason: string) {
  try {
    // We use a transaction or just update, the trigger will handle the log
    await db.update(products)
      .set({ quantity: newQuantity })
      .where(eq(products.id, id));
    
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating quantity:", error);
    return { success: false, error: "Failed to update quantity" };
  }
}

export async function getLowStockAlerts() {
  try {
    // Using the stored procedure logic (as a query for simplicity in ORM)
    return await db.select()
      .from(products)
      .where(sql`${products.quantity} <= ${products.minStock}`);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
}

export async function deleteProduct(id: number) {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
