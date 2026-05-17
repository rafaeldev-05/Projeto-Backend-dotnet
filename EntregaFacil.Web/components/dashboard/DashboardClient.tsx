"use client";

import { Boxes, ClipboardList, PackageCheck, Truck } from "lucide-react";
import { useCarriers } from "@/hooks/useCarriers";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { orderStatusLabels } from "@/lib/formatters";
import type { OrderStatus } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { ErrorState, LoadingState } from "@/components/ui/States";

export function DashboardClient() {
  const products = useProducts();
  const orders = useOrders();
  const carriers = useCarriers();

  const isLoading = products.isLoading || orders.isLoading || carriers.isLoading;
  const error = products.error || orders.error || carriers.error;

  if (isLoading) {
    return <LoadingState label="Calculando indicadores da operacao..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const statusCounts = orders.orders.reduce(
    (acc, order) => {
      acc[order.status] += 1;
      return acc;
    },
    {
      AwaitingSeparation: 0,
      InSeparation: 0,
      ReadyForShipping: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    } satisfies Record<OrderStatus, number>,
  );

  const stats = [
    { label: "Produtos", value: products.products.length, icon: Boxes, tone: "text-red-900 bg-red-50" },
    { label: "Pedidos", value: orders.orders.length, icon: ClipboardList, tone: "text-rose-900 bg-rose-50" },
    { label: "Transportadoras", value: carriers.carriers.length, icon: Truck, tone: "text-red-800 bg-stone-100" },
    { label: "Entregues", value: statusCounts.Delivered, icon: PackageCheck, tone: "text-teal-800 bg-teal-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-800">Painel operacional</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Indicadores calculados diretamente dos dados retornados pela API local.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{stat.value}</p>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-md ${stat.tone}`}>
                  <Icon size={23} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-950">Pedidos por status</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(statusCounts) as OrderStatus[]).map((status) => (
            <div key={status} className="rounded-md border border-stone-100 bg-[#fbf8f7] p-4">
              <p className="text-sm font-medium text-slate-500">{orderStatusLabels[status]}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{statusCounts[status]}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
