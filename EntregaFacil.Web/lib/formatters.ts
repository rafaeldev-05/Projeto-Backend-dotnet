import type { DeliveryOccurrenceType, OrderStatus } from "./types";

export const orderStatusLabels: Record<OrderStatus, string> = {
  AwaitingSeparation: "Aguardando separacao",
  InSeparation: "Em separacao",
  ReadyForShipping: "Pronto para envio",
  Shipped: "Enviado",
  Delivered: "Entregue",
  Cancelled: "Cancelado",
};

export const occurrenceTypeLabels: Record<DeliveryOccurrenceType, string> = {
  AddressNotFound: "Endereco nao localizado",
  RecipientAbsent: "Destinatario ausente",
  DeliveryDelayed: "Entrega atrasada",
  DamagedPackage: "Pacote danificado",
  Other: "Outro",
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function toDateTimeLocalValue(value = new Date()) {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function toIsoFromDateTimeLocal(value: string) {
  return new Date(value).toISOString();
}
