import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "EntregaFacil | Controle de Entregas",
  description: "Aplicacao fullstack para controle de entregas de loja virtual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-[#fbf8f7] text-slate-950">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
