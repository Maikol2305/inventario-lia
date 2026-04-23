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
import { Button } from "@/components/ui/button";
import { Search, Filter, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddProductDialog } from "@/components/inventory/AddProductDialog";
import { DeleteProductDialog } from "@/components/inventory/DeleteProductDialog";

export default async function InventoryPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Módulo de Inventario</h1>
          <p className="text-slate-500">Gestión centralizada de productos y materiales</p>
        </div>
        <div className="flex gap-2">
           <AddProductDialog />
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por SKU o nombre..." 
              className="pl-10 h-10 border-slate-200 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="w-4 h-4 mr-2" />
              Categoría
            </Button>
            <Button variant="outline" size="sm" className="h-10">
              Exportar
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">SKU</TableHead>
              <TableHead className="font-bold text-slate-700">Nombre</TableHead>
              <TableHead className="font-bold text-slate-700">Categoría</TableHead>
              <TableHead className="font-bold text-slate-700">Stock Actual</TableHead>
              <TableHead className="font-bold text-slate-700">Mínimo</TableHead>
              <TableHead className="font-bold text-slate-700">Estado</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-slate-50 transition-colors group">
                <TableCell className="font-mono text-sm text-slate-600">{product.sku}</TableCell>
                <TableCell className="font-medium text-slate-900">{product.name}</TableCell>
                <TableCell>
                   <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                    {product.category || 'Sin categoría'}
                  </Badge>
                </TableCell>
                <TableCell className="text-lg font-bold">{product.quantity}</TableCell>
                <TableCell className="text-slate-500">{product.minStock}</TableCell>
                <TableCell>
                  {product.quantity <= product.minStock ? (
                    <Badge variant="destructive" className="bg-red-500">Bajo Stock</Badge>
                  ) : (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      Disponible
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <DeleteProductDialog id={product.id} name={product.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-slate-100 p-4 rounded-full">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No se encontraron productos en el inventario.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-slate-500">
        <p>Mostrando {products.length} productos en total</p>
      </div>
    </div>
  );
}
