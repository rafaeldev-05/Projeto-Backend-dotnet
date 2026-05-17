"use client";

import { FormEvent, useState } from "react";
import { Eye, Plus, RefreshCw, Truck } from "lucide-react";
import { api } from "@/lib/api";
import type { Carrier } from "@/lib/types";
import { useCarriers } from "@/hooks/useCarriers";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";

export function CarriersClient() {
  const { carriers, isLoading, error, refresh } = useCarriers();
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState<Carrier | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);
    setFeedback(null);

    try {
      await api.carriers.create({ name, cnpj, phone: phone || null });
      setName("");
      setCnpj("");
      setPhone("");
      setFeedback("Transportadora cadastrada com sucesso.");
      await refresh();
    } catch (exception) {
      setFormError(exception instanceof Error ? exception.message : "Erro ao cadastrar transportadora.");
    } finally {
      setIsSaving(false);
    }
  }

  async function showDetails(id: number) {
    try {
      setSelected(await api.carriers.get(id));
    } catch (exception) {
      setFormError(exception instanceof Error ? exception.message : "Erro ao carregar transportadora.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-800">Logistica</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Transportadoras</h1>
          <p className="mt-2 text-sm text-slate-500">Empresas usadas para registrar envios dos pedidos.</p>
        </div>
        <Button onClick={refresh} variant="secondary" icon={<RefreshCw size={16} />}>
          Atualizar
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <Card>
          <CardHeader title="Nova transportadora" description="Use dados ficticios para demonstracao." />
          <form className="grid gap-4 p-5" onSubmit={handleSubmit}>
            {formError ? <ErrorState message={formError} /> : null}
            {feedback ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{feedback}</div> : null}
            <Field label="Nome">
              <Input required value={name} onChange={(event) => setName(event.target.value)} placeholder="FastLog Express" />
            </Field>
            <Field label="CNPJ">
              <Input required value={cnpj} onChange={(event) => setCnpj(event.target.value)} placeholder="00.000.000/0001-00" />
            </Field>
            <Field label="Telefone">
              <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(11) 3000-0000" />
            </Field>
            <Button disabled={isSaving} icon={<Plus size={16} />}>Cadastrar transportadora</Button>
          </form>
        </Card>

        <div>
          {isLoading ? <LoadingState label="Carregando transportadoras..." /> : null}
          {error ? <ErrorState message={error} /> : null}
          {!isLoading && !error && carriers.length === 0 ? (
            <EmptyState title="Nenhuma transportadora cadastrada" description="Cadastre uma transportadora para enviar pedidos." />
          ) : null}
          {!isLoading && !error && carriers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {carriers.map((carrier) => (
                <Card key={carrier.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-md bg-red-50 text-red-800">
                        <Truck size={21} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950">{carrier.name}</h2>
                        <p className="mt-1 text-sm text-slate-500">{carrier.cnpj}</p>
                        <p className="mt-1 text-sm text-slate-500">{carrier.phone || "Telefone nao informado"}</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="h-9 w-9 px-0" icon={<Eye size={16} />} onClick={() => void showDetails(carrier.id)}>
                      <span className="sr-only">Detalhes</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <Modal title="Detalhes da transportadora" isOpen={selected !== null} onClose={() => setSelected(null)}>
        {selected ? (
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-500">Nome</dt>
              <dd className="mt-1 text-slate-950">{selected.name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">CNPJ</dt>
              <dd className="mt-1 text-slate-950">{selected.cnpj}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">Telefone</dt>
              <dd className="mt-1 text-slate-950">{selected.phone || "Nao informado"}</dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}
