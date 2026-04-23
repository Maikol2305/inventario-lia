'use server'

import { mockProducts } from "@/lib/db/mock-data";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return mockProducts;
}

export async function createProduct(data: any) {
  const newProduct = {
    id: mockProducts.length + 1,
    ...data,
    lastUpdated: new Date()
  };
  mockProducts.push(newProduct);
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateProductQuantity(id: number, newQuantity: number, reason: string) {
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts[index].quantity = newQuantity;
    mockProducts[index].lastUpdated = new Date();
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    return { success: true };
  }
  return { success: false, error: "Producto no encontrado" };
}

export async function getLowStockAlerts() {
  return mockProducts.filter(p => p.quantity <= p.minStock);
}

export async function deleteProduct(id: number) {
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    return { success: true };
  }
  return { success: false, error: "Producto no encontrado" };
}
