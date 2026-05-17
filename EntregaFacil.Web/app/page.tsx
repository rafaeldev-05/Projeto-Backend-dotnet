import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Boxes, ClipboardList, MessageSquareWarning, PackageCheck, Star, Truck } from "lucide-react";

export default function Home() {
  const heroHighlights = [
    "Gestao de Pedidos",
    "Controle de Entregas",
    "Rastreamento",
    "Ocorrencias",
    "Avaliacoes",
    "Fluxo Organizado",
  ];

  const modules = [
    { title: "Produtos", description: "Cadastro e controle visual de estoque.", icon: Boxes },
    { title: "Pedidos", description: "Acompanhamento do ciclo completo do pedido.", icon: ClipboardList },
    { title: "Transportadoras", description: "Cadastro das empresas responsaveis pela entrega.", icon: Truck },
    { title: "Envio", description: "Registro de rastreamento e data de postagem.", icon: PackageCheck },
    { title: "Ocorrencias", description: "Historico de problemas sem encerrar a entrega.", icon: MessageSquareWarning },
    { title: "Avaliacoes", description: "Feedback do cliente depois da entrega confirmada.", icon: Star },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="/entregafacil-hero.png"
          alt="Painel visual do EntregaFacil com pedidos, entregas e estoque"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-red-950/70" />
        <div className="relative z-10 flex min-h-[88vh] items-center px-4 py-20 sm:px-8 lg:px-16">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-100">Sistema para controle logistico</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-tight sm:text-6xl">EntregaFacil</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              Controle entregas, acompanhe pedidos e organize cada etapa do envio em uma experiencia simples, visual e eficiente.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-900">
              {heroHighlights.map((highlight) => (
                <span key={highlight} className="rounded-full bg-white/90 px-3 py-2">
                  {highlight}
                </span>
              ))}
            </div>
            <Link
              href="/dashboard"
              className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-md bg-red-700 px-5 text-sm font-bold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-800"
            >
              Acessar painel
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-800">Modulos do sistema</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Uma operacao de entrega visivel de ponta a ponta</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Projeto fullstack desenvolvido para portfolio tecnico, com backend .NET, API REST e frontend em Next.js.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <article key={module.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-red-50 text-red-800">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{module.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
