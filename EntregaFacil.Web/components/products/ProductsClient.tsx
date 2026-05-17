"use client";

import { FormEvent, useState } from "react";
import { Edit, Plus, RefreshCw, Save } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/formatters";
import type { Product } from "@/lib/types";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";

type ProductFormState = {
  code: string;
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
};

const emptyForm: ProductFormState = {
  code: "",
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
};

function toForm(product: Product): ProductFormState {
  return {
    code: product.code,
    name: product.name,
    description: product.description ?? "",
    price: String(product.price),
    stockQuantity: String(product.stockQuantity),
  };
}

export function ProductsClient() {
  const { products, isLoading, error, refresh } = useProducts();
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editing, setEditing] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);
    setFeedback(null);

    try {
      const payload = {
        code: form.code,
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
      };

      if (editing) {
        await api.products.update(editing.id, payload);
        setFeedback("Produto atualizado com sucesso.");
      } else {
        await api.products.create(payload);
        setFeedback("Produto cadastrado com sucesso.");
      }

      setForm(emptyForm);
      setEditing(null);
      await refresh();
    } catch (exception) {
      setFormError(exception instanceof Error ? exception.message : "Erro ao salvar produto.");
    } finally {
      setIsSaving(false);
    }
  }

  function startEdit(product: Product) {
    setEditing(product);
    setForm(toForm(product));
    setFeedback(null);
    setFormError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-800">Catalogo</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Produtos</h1>
          <p className="mt-2 text-sm text-slate-500">Cadastre produtos e acompanhe o estoque disponivel para separacao.</p>
        </div>
        <Button onClick={refresh} variant="secondary" icon={<RefreshCw size={16} />}>
          Atualizar
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <Card>
          <CardHeader title={editing ? "Editar produto" : "Novo produto"} description="Dados ficticios para demonstracao." />
          <form className="grid gap-4 p-5" onSubmit={handleSubmit}>
            {formError ? <ErrorState message={formError} /> : null}
            {feedback ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{feedback}</div> : null}
            <Field label="Codigo">
              <Input required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="PRD-004" />
            </Field>
            <Field label="Nome">
              <Input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Headset USB" />
            </Field>
            <Field label="Descricao">
              <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descricao curta do produto" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Preco">
                <Input required min="0.01" step="0.01" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
              </Field>
              <Field label="Estoque">
                <Input required min="0" step="1" type="number" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled={isSaving} icon={editing ? <Save size={16} /> : <Plus size={16} />}>
                {editing ? "Salvar alteracoes" : "Cadastrar produto"}
              </Button>
              {editing ? (
                <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm(emptyForm); }}>
                  Cancelar edicao
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <div>
          {isLoading ? <LoadingState label="Carregando produtos..." /> : null}
          {error ? <ErrorState message={error} /> : null}
          {!isLoading && !error && products.length === 0 ? (
            <EmptyState title="Nenhum produto cadastrado" description="Cadastre o primeiro produto para testar pedidos." />
          ) : null}
          {!isLoading && !error && products.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => {
                const stockTone = product.stockQuantity === 0 ? "red" : product.stockQuantity <= 5 ? "amber" : "green";
                const stockLabel = product.stockQuantity === 0 ? "Sem estoque" : product.stockQuantity <= 5 ? "Estoque baixo" : "Disponivel";

                return (
                  <Card key={product.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{product.code}</p>
                        <h2 className="mt-2 text-lg font-semibold text-slate-950">{product.name}</h2>
                        <p className="mt-1 text-sm text-slate-500">{product.description || "Sem descricao."}</p>
                      </div>
                      <Button variant="ghost" className="h-9 w-9 px-0" onClick={() => startEdit(product)} icon={<Edit size={16} />}>
                        <span className="sr-only">Editar</span>
                      </Button>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <span className="text-lg font-bold text-slate-950">{formatCurrency(product.price)}</span>
                      <Badge tone={stockTone}>{stockLabel}</Badge>
                      <span className="text-sm text-slate-500">{product.stockQuantity} unidades</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
