import StockAlerts from "@/components/inventory/StockAlerts";
import { getProducts } from "@/app/actions/inventory";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 mb-2">
          Laboratorio LÍA
        </h1>
        <p className="text-xl text-slate-600 font-medium">
          Sistema de Control de Inventario
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-bold mb-4">Alertas Activas</h2>
        <StockAlerts />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Resumen de Inventario</h2>
        <div className="rounded-md border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category || 'N/A'}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    {product.quantity <= product.minStock ? (
                      <Badge variant="destructive">Bajo Stock</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Normal
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    No hay productos registrados en el inventario.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
