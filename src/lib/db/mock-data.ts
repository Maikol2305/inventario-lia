// Mock database for LÍA - Use this until real PostgreSQL is ready
export let mockProducts = [
  { id: 1, sku: "LIA-001", name: "Arduino Uno R3", description: "Microcontrolador para prototipado", quantity: 2, minStock: 5, category: "Hardware", lastUpdated: new Date() },
  { id: 2, sku: "LIA-002", name: "Sensor Ultrasonico HC-SR04", description: "Sensor de distancia", quantity: 15, minStock: 10, category: "Sensores", lastUpdated: new Date() },
  { id: 3, sku: "LIA-003", name: "Raspberry Pi 4 (8GB)", description: "Computadora de placa única", quantity: 1, minStock: 3, category: "Computación", lastUpdated: new Date() },
  { id: 4, sku: "LIA-004", name: "Kit de Jumpers (65 pcs)", description: "Cables de conexión", quantity: 50, minStock: 20, category: "Componentes", lastUpdated: new Date() },
];

export const mockUsers = [
  { id: 1, name: "Admin LÍA", email: "admin@lia.com", password: "lia2026", role: "admin" }
];
