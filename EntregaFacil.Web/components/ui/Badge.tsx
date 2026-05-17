import type { OrderStatus } from "@/lib/types";
import { orderStatusLabels } from "@/lib/formatters";

const statusClasses: Record<OrderStatus, string> = {
  AwaitingSeparation: "bg-amber-50 text-amber-800 ring-amber-200",
  InSeparation: "bg-red-50 text-red-800 ring-red-200",
  ReadyForShipping: "bg-rose-50 text-rose-800 ring-rose-200",
  Shipped: "bg-purple-50 text-purple-800 ring-purple-200",
  Delivered: "bg-teal-50 text-teal-800 ring-teal-200",
  Cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClasses[status]}`}>
      {orderStatusLabels[status]}
    </span>
  );
}

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "amber" | "red" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-teal-50 text-teal-700 ring-teal-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    red: "bg-red-50 text-red-800 ring-red-200",
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>{children}</span>;
}
