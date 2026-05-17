"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ClipboardList,
  Eye,
  MessageSquareWarning,
  PackageCheck,
  Plus,
  RefreshCw,
  Send,
  Star,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, occurrenceTypeLabels, toDateTimeLocalValue, toIsoFromDateTimeLocal } from "@/lib/formatters";
import type { DeliveryOccurrence, DeliveryOccurrenceType, DeliveryReview, Order } from "@/lib/types";
import { useCarriers } from "@/hooks/useCarriers";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";

type NewOrderItem = {
  productId: string;
  quantity: string;
};

const occurrenceTypes: DeliveryOccurrenceType[] = [
  "AddressNotFound",
  "RecipientAbsent",
  "DeliveryDelayed",
  "DamagedPackage",
  "Other",
];

export function OrdersClient() {
  const { orders, isLoading, error, refresh } = useOrders();
  const products = useProducts();
  const carriers = useCarriers();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [items, setItems] = useState<NewOrderItem[]>([{ productId: "", quantity: "1" }]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shipOrder, setShipOrder] = useState<Order | null>(null);
  const [occurrenceOrder, setOccurrenceOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [occurrences, setOccurrences] = useState<DeliveryOccurrence[]>([]);
  const [review, setReview] = useState<DeliveryReview | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const productOptions = products.products;

  const totalPreview = useMemo(() => {
    return items.reduce((total, item) => {
      const product = productOptions.find((candidate) => candidate.id === Number(item.productId));
      return total + (product?.price ?? 0) * Number(item.quantity || 0);
    }, 0);
  }, [items, productOptions]);

  async function runAction(action: () => Promise<unknown>, successMessage: string) {
    setIsSaving(true);
    setFormError(null);
    setFeedback(null);

    try {
      await action();
      setFeedback(successMessage);
      await refresh();
    } catch (exception) {
      setFormError(exception instanceof Error ? exception.message : "Erro ao executar acao.");
    } finally {
      setIsSaving(false);
    }
  }

  async function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(async () => {
      await api.orders.create({
        customerName,
        customerEmail,
        items: items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      });
      setCustomerName("");
      setCustomerEmail("");
      setItems([{ productId: "", quantity: "1" }]);
    }, "Pedido criado com sucesso.");
  }

  async function openDetails(orderId: number) {
    setFormError(null);
    setSelectedOrder(await api.orders.get(orderId));
  }

  async function openOccurrences(order: Order) {
    setOccurrenceOrder(order);
    setOccurrences(await api.orders.listOccurrences(order.id));
  }

  async function openReview(order: Order) {
    setReviewOrder(order);
    try {
      setReview(await api.orders.getReview(order.id));
    } catch {
      setReview(null);
    }
  }

  function addItem() {
    setItems([...items, { productId: "", quantity: "1" }]);
  }

  function updateItem(index: number, item: NewOrderItem) {
    setItems(items.map((current, currentIndex) => (currentIndex === index ? item : current)));
  }

  function removeItem(index: number) {
    setItems(items.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-800">Fluxo de entregas</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Pedidos</h1>
          <p className="mt-2 text-sm text-slate-500">Crie pedidos ficticios e avance pelas regras do backend.</p>
        </div>
        <Button onClick={refresh} variant="secondary" icon={<RefreshCw size={16} />}>
          Atualizar
        </Button>
      </div>

      {formError ? <ErrorState message={formError} /> : null}
      {feedback ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{feedback}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
        <Card>
          <CardHeader title="Novo pedido" description="Simula o papel do cliente criando uma compra." />
          <form className="grid gap-4 p-5" onSubmit={createOrder}>
            <Field label="Cliente">
              <Input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Marina Costa" />
            </Field>
            <Field label="E-mail">
              <Input required type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="marina@example.com" />
            </Field>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Itens</span>
                <Button type="button" variant="ghost" onClick={addItem} icon={<Plus size={15} />}>
                  Item
                </Button>
              </div>
              {items.map((item, index) => (
                <div key={index} className="grid gap-2 rounded-md border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_90px_36px]">
                  <Select required value={item.productId} onChange={(event) => updateItem(index, { ...item, productId: event.target.value })}>
                    <option value="">Produto</option>
                    {productOptions.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Select>
                  <Input required min="1" type="number" value={item.quantity} onChange={(event) => updateItem(index, { ...item, quantity: event.target.value })} />
                  <Button type="button" variant="ghost" className="h-10 px-0" onClick={() => removeItem(index)} disabled={items.length === 1} icon={<XCircle size={16} />}>
                    <span className="sr-only">Remover</span>
                  </Button>
                </div>
              ))}
            </div>
            <div className="rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              Previa do total: {formatCurrency(totalPreview)}
            </div>
            <Button disabled={isSaving || products.isLoading} icon={<Plus size={16} />}>Criar pedido</Button>
          </form>
        </Card>

        <section>
          {isLoading ? <LoadingState label="Carregando pedidos..." /> : null}
          {error ? <ErrorState message={error} /> : null}
          {!isLoading && !error && orders.length === 0 ? (
            <EmptyState title="Nenhum pedido encontrado" description="Crie um pedido para testar o fluxo de separacao e entrega." />
          ) : null}
          {!isLoading && !error && orders.length > 0 ? (
            <div className="grid gap-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSaving={isSaving}
                  onDetails={() => void openDetails(order.id)}
                  onStart={() => void runAction(() => api.orders.startSeparation(order.id), "Separacao iniciada.")}
                  onConfirmSeparation={() => void runAction(() => api.orders.confirmSeparation(order.id), "Separacao confirmada e estoque atualizado.")}
                  onCancelCustomer={() => void runAction(() => api.orders.cancelByCustomer(order.id), "Pedido cancelado pelo cliente.")}
                  onCancelStock={() => void runAction(() => api.orders.cancelByStock(order.id), "Pedido cancelado por falta de estoque.")}
                  onShip={() => setShipOrder(order)}
                  onConfirmDelivery={() => void runAction(() => api.orders.confirmDelivery(order.id), "Entrega confirmada.")}
                  onOccurrence={() => void openOccurrences(order)}
                  onReview={() => void openReview(order)}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <DetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      <ShipModal order={shipOrder} carriers={carriers.carriers} onClose={() => setShipOrder(null)} onDone={async () => { setShipOrder(null); await refresh(); }} />
      <OccurrenceModal order={occurrenceOrder} occurrences={occurrences} onClose={() => setOccurrenceOrder(null)} onDone={() => void openOccurrences(occurrenceOrder!)} />
      <ReviewModal order={reviewOrder} review={review} onClose={() => setReviewOrder(null)} onDone={() => void openReview(reviewOrder!)} />
    </div>
  );
}

function OrderCard({
  order,
  isSaving,
  onDetails,
  onStart,
  onConfirmSeparation,
  onCancelCustomer,
  onCancelStock,
  onShip,
  onConfirmDelivery,
  onOccurrence,
  onReview,
}: {
  order: Order;
  isSaving: boolean;
  onDetails: () => void;
  onStart: () => void;
  onConfirmSeparation: () => void;
  onCancelCustomer: () => void;
  onCancelStock: () => void;
  onShip: () => void;
  onConfirmDelivery: () => void;
  onOccurrence: () => void;
  onReview: () => void;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-950">#{order.number || order.id}</h2>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-2 text-sm text-slate-500">{order.customerName} · {order.customerEmail}</p>
          <p className="mt-1 text-sm text-slate-500">{formatDate(order.orderDate)} · {formatCurrency(order.totalAmount)}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            {order.items.map((item) => (
              <span key={item.id} className="rounded-full bg-slate-100 px-2 py-1">
                {item.quantity}x {item.productName}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button variant="secondary" onClick={onDetails} icon={<Eye size={16} />}>Detalhes</Button>
          {order.status === "AwaitingSeparation" ? (
            <>
              <Button disabled={isSaving} onClick={onStart} icon={<ClipboardList size={16} />}>Iniciar separacao</Button>
              <Button disabled={isSaving} variant="danger" onClick={onCancelCustomer} icon={<XCircle size={16} />}>Cancelar cliente</Button>
            </>
          ) : null}
          {order.status === "InSeparation" ? (
            <>
              <Button disabled={isSaving} onClick={onConfirmSeparation} icon={<PackageCheck size={16} />}>Confirmar separacao</Button>
              <Button disabled={isSaving} variant="danger" onClick={onCancelStock} icon={<XCircle size={16} />}>Cancelar estoque</Button>
            </>
          ) : null}
          {order.status === "ReadyForShipping" ? <Button onClick={onShip} icon={<Send size={16} />}>Enviar pedido</Button> : null}
          {order.status === "Shipped" ? (
            <>
              <Button variant="secondary" onClick={onOccurrence} icon={<MessageSquareWarning size={16} />}>Ocorrencias</Button>
              <Button onClick={onConfirmDelivery} icon={<PackageCheck size={16} />}>Confirmar entrega</Button>
            </>
          ) : null}
          {order.status === "Delivered" ? <Button variant="secondary" onClick={onReview} icon={<Star size={16} />}>Avaliacao</Button> : null}
        </div>
      </div>
    </Card>
  );
}

function DetailsModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  return (
    <Modal title="Detalhes do pedido" isOpen={order !== null} onClose={onClose}>
      {order ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-slate-950">#{order.number}</h3>
            <StatusBadge status={order.status} />
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold text-slate-500">Cliente</dt><dd className="mt-1 text-slate-950">{order.customerName}</dd></div>
            <div><dt className="font-semibold text-slate-500">E-mail</dt><dd className="mt-1 text-slate-950">{order.customerEmail}</dd></div>
            <div><dt className="font-semibold text-slate-500">Data</dt><dd className="mt-1 text-slate-950">{formatDate(order.orderDate)}</dd></div>
            <div><dt className="font-semibold text-slate-500">Total</dt><dd className="mt-1 text-slate-950">{formatCurrency(order.totalAmount)}</dd></div>
          </dl>
          <div>
            <h4 className="text-sm font-semibold text-slate-700">Itens</h4>
            <div className="mt-2 divide-y divide-slate-100 rounded-md border border-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="grid gap-1 p-3 text-sm sm:grid-cols-[1fr_90px_110px]">
                  <span className="font-medium text-slate-950">{item.productName}</span>
                  <span>{item.quantity} un.</span>
                  <span>{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function ShipModal({ order, carriers, onClose, onDone }: { order: Order | null; carriers: Array<{ id: number; name: string }>; onClose: () => void; onDone: () => Promise<void> }) {
  const [carrierId, setCarrierId] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [shippingDate, setShippingDate] = useState(toDateTimeLocalValue());
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    setIsSaving(true);
    setError(null);
    try {
      await api.orders.ship(order.id, {
        carrierId: Number(carrierId),
        trackingCode,
        shippingDate: toIsoFromDateTimeLocal(shippingDate),
      });
      await onDone();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Erro ao enviar pedido.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal title="Enviar pedido" isOpen={order !== null} onClose={onClose}>
      <form className="grid gap-4" onSubmit={submit}>
        {error ? <ErrorState message={error} /> : null}
        <Field label="Transportadora">
          <Select required value={carrierId} onChange={(event) => setCarrierId(event.target.value)}>
            <option value="">Selecione</option>
            {carriers.map((carrier) => <option key={carrier.id} value={carrier.id}>{carrier.name}</option>)}
          </Select>
        </Field>
        <Field label="Codigo de rastreamento">
          <Input required value={trackingCode} onChange={(event) => setTrackingCode(event.target.value)} placeholder="BR123456789" />
        </Field>
        <Field label="Data de envio">
          <Input required type="datetime-local" value={shippingDate} onChange={(event) => setShippingDate(event.target.value)} />
        </Field>
        <Button disabled={isSaving} icon={<Send size={16} />}>Registrar envio</Button>
      </form>
    </Modal>
  );
}

function OccurrenceModal({ order, occurrences, onClose, onDone }: { order: Order | null; occurrences: DeliveryOccurrence[]; onClose: () => void; onDone: () => void }) {
  const [type, setType] = useState<DeliveryOccurrenceType>("RecipientAbsent");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    try {
      setError(null);
      await api.orders.createOccurrence(order.id, { type, description });
      setDescription("");
      onDone();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Erro ao registrar ocorrencia.");
    }
  }

  return (
    <Modal title="Ocorrencias da entrega" isOpen={order !== null} onClose={onClose}>
      <form className="grid gap-4" onSubmit={submit}>
        {error ? <ErrorState message={error} /> : null}
        <Field label="Tipo">
          <Select value={type} onChange={(event) => setType(event.target.value as DeliveryOccurrenceType)}>
            {occurrenceTypes.map((item) => <option key={item} value={item}>{occurrenceTypeLabels[item]}</option>)}
          </Select>
        </Field>
        <Field label="Descricao">
          <Textarea required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descreva o problema informado pela transportadora." />
        </Field>
        <Button icon={<MessageSquareWarning size={16} />}>Registrar ocorrencia</Button>
      </form>
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="text-sm font-semibold text-slate-700">Timeline</h3>
        {occurrences.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Nenhuma ocorrencia registrada.</p>
        ) : (
          <ol className="mt-4 space-y-4">
            {occurrences.map((occurrence) => (
              <li key={occurrence.id} className="border-l-2 border-red-200 pl-4">
                <p className="text-sm font-semibold text-slate-950">{occurrenceTypeLabels[occurrence.type]}</p>
                <p className="text-xs text-slate-500">{formatDate(occurrence.date)}</p>
                <p className="mt-1 text-sm text-slate-600">{occurrence.description}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Modal>
  );
}

function ReviewModal({ order, review, onClose, onDone }: { order: Order | null; review: DeliveryReview | null; onClose: () => void; onDone: () => void }) {
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    try {
      setError(null);
      await api.orders.createReview(order.id, { rating: Number(rating), comment: comment || null });
      setComment("");
      onDone();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Erro ao registrar avaliacao.");
    }
  }

  return (
    <Modal title="Avaliacao da entrega" isOpen={order !== null} onClose={onClose}>
      {review ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">Avaliacao existente</p>
          <p className="mt-2 text-2xl font-bold text-red-950">{review.rating}/5</p>
          <p className="mt-2 text-sm text-red-800">{review.comment || "Sem comentario."}</p>
          <p className="mt-2 text-xs text-red-700">{formatDate(review.createdAt)}</p>
        </div>
      ) : (
        <form className="grid gap-4" onSubmit={submit}>
          {error ? <ErrorState message={error} /> : null}
          <Field label="Nota">
            <Select value={rating} onChange={(event) => setRating(event.target.value)}>
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
            </Select>
          </Field>
          <Field label="Comentario">
            <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Comentario opcional sobre a entrega." />
          </Field>
          <Button icon={<Star size={16} />}>Registrar avaliacao</Button>
        </form>
      )}
    </Modal>
  );
}
