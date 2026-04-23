'use client'

import { useState, useEffect, useTransition } from "react";
import { getLowStockAlerts, updateProductQuantity } from "@/app/actions/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, PackagePlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function StockAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [replenishAmount, setReplenishAmount] = useState<number>(10);
  const [isOpen, setIsOpen] = useState<number | null>(null);

  async function loadAlerts() {
    const data = await getLowStockAlerts();
    setAlerts(data);
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleReplenish = async (productId: number, currentQuantity: number) => {
    startTransition(async () => {
      const newQuantity = currentQuantity + replenishAmount;
      const result = await updateProductQuantity(productId, newQuantity, "Reposición desde alerta rápida");
      if (result.success) {
        setIsOpen(null);
        loadAlerts(); // Refresh alerts list
      }
    });
  };

  if (alerts.length === 0) return (
    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2 mb-8">
      <PackagePlus className="w-5 h-5" />
      <span>El inventario está en niveles óptimos. No hay alertas pendientes.</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {alerts.map((product) => {
        // Calculate percentage (clamped to 100 for visual consistency)
        const progressValue = Math.min((product.quantity / product.minStock) * 100, 100);
        
        return (
          <Dialog 
            key={product.id} 
            open={isOpen === product.id} 
            onOpenChange={(open) => {
              setIsOpen(open ? product.id : null);
              if (open) setReplenishAmount(product.minStock - product.quantity + 10);
            }}
          >
            <DialogTrigger>
              <div className="cursor-pointer">
              <Card className="border-l-4 border-red-500 shadow-md hover:shadow-lg transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                   <AlertTriangle className="w-16 h-16 text-red-600" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="destructive" className="animate-pulse">Crítico</Badge>
                    <span className="text-xs font-mono text-slate-500">{product.sku}</span>
                  </div>
                  <CardTitle className="text-lg font-bold mt-2 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-slate-500">Stock Actual</p>
                      <p className="text-2xl font-black text-slate-900">{product.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Mínimo Requerido</p>
                      <p className="text-lg font-bold text-slate-700">{product.minStock}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Nivel de Stock</span>
                      <span className={progressValue < 30 ? "text-red-600" : "text-amber-600"}>
                        {Math.round(progressValue)}%
                      </span>
                    </div>
                    <Progress value={progressValue} className="h-2 bg-slate-100" />
                  </div>
                </CardContent>
              </Card>
              </div>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Info className="w-6 h-6 text-red-600" />
                  Interacción de Reposición: {product.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-6 py-6">
                {/* Visual Gap Representation */}
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700 font-bold">Faltante para Mínimo:</p>
                    <p className="text-3xl font-black text-red-900">{product.minStock - product.quantity} unidades</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-200 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-700" />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="font-bold">Cantidad a Reponer</Label>
                    <div className="flex gap-2">
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        value={replenishAmount}
                        onChange={(e) => setReplenishAmount(parseInt(e.target.value) || 0)}
                        className="text-lg h-12"
                      />
                      <div className="flex flex-col justify-center text-xs text-slate-500">
                        <span>Resultará en:</span>
                        <span className="font-bold text-green-600 text-sm">
                          {product.quantity + replenishAmount} total
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded border border-slate-200">
                  <p><strong>Nota:</strong> Esta acción registrará automáticamente un movimiento de entrada en el historial del Laboratorio LÍA.</p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(null)}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleReplenish(product.id, product.quantity)}
                  disabled={isPending || replenishAmount <= 0}
                >
                  {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                  ) : (
                    <><PackagePlus className="mr-2 h-4 w-4" /> Registrar Entrada</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}
