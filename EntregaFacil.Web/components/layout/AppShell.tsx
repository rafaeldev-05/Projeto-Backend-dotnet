"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, Home, PackageCheck, Truck } from "lucide-react";

const navigation = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/products", label: "Produtos", icon: Boxes },
  { href: "/orders", label: "Pedidos", icon: PackageCheck },
  { href: "/carriers", label: "Transportadoras", icon: Truck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#fbf8f7]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-stone-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-stone-100 px-6">
          <Link href="/" className="text-xl font-bold text-slate-950">
            Entrega<span className="text-red-800">Facil</span>
          </Link>
        </div>
        <nav className="grid gap-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
                  active ? "bg-red-50 text-red-900" : "text-slate-600 hover:bg-stone-100 hover:text-red-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="text-lg font-bold text-slate-950">
          Entrega<span className="text-red-800">Facil</span>
        </Link>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navigation.slice(1).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-xs font-semibold ${
                  active ? "bg-red-50 text-red-900" : "bg-stone-100 text-slate-600"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
