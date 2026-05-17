import { AlertCircle, Loader2, PackageOpen } from "lucide-react";

export function LoadingState({ label = "Carregando dados..." }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 rounded-lg border border-dashed border-stone-200 bg-white text-sm text-slate-500">
      <Loader2 className="animate-spin" size={18} />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-32 items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      <AlertCircle size={18} />
      {message}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid min-h-40 place-items-center rounded-lg border border-dashed border-stone-200 bg-white p-6 text-center">
      <PackageOpen className="mx-auto text-slate-400" size={26} />
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
