import type {
  Carrier,
  CreateCarrierRequest,
  CreateDeliveryOccurrenceRequest,
  CreateDeliveryReviewRequest,
  CreateOrderRequest,
  CreateProductRequest,
  DeliveryOccurrence,
  DeliveryReview,
  Order,
  Product,
  ShipOrderRequest,
  Shipment,
  UpdateProductRequest,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5191";

type ApiError = {
  message?: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = "Nao foi possivel concluir a operacao.";

    try {
      const error = (await response.json()) as ApiError;
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function jsonBody(body: unknown): RequestInit {
  return {
    method: "POST",
    body: JSON.stringify(body),
  };
}

export const api = {
  baseUrl: API_URL,

  products: {
    list: () => request<Product[]>("/api/products"),
    get: (id: number) => request<Product>(`/api/products/${id}`),
    create: (payload: CreateProductRequest) =>
      request<Product>("/api/products", jsonBody(payload)),
    update: (id: number, payload: UpdateProductRequest) =>
      request<Product>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
  },

  orders: {
    list: () => request<Order[]>("/api/orders"),
    get: (id: number) => request<Order>(`/api/orders/${id}`),
    create: (payload: CreateOrderRequest) =>
      request<Order>("/api/orders", jsonBody(payload)),
    startSeparation: (id: number) =>
      request<Order>(`/api/orders/${id}/start-separation`, { method: "POST" }),
    confirmSeparation: (id: number) =>
      request<Order>(`/api/orders/${id}/confirm-separation`, { method: "POST" }),
    cancelByCustomer: (id: number) =>
      request<Order>(`/api/orders/${id}/cancel-by-customer`, { method: "POST" }),
    cancelByStock: (id: number) =>
      request<Order>(`/api/orders/${id}/cancel-by-stock`, { method: "POST" }),
    ship: (id: number, payload: ShipOrderRequest) =>
      request<Shipment>(`/api/orders/${id}/ship`, jsonBody(payload)),
    confirmDelivery: (id: number) =>
      request<Shipment>(`/api/orders/${id}/confirm-delivery`, { method: "POST" }),
    listOccurrences: (id: number) =>
      request<DeliveryOccurrence[]>(`/api/orders/${id}/occurrences`),
    createOccurrence: (id: number, payload: CreateDeliveryOccurrenceRequest) =>
      request<DeliveryOccurrence>(`/api/orders/${id}/occurrences`, jsonBody(payload)),
    getReview: (id: number) => request<DeliveryReview>(`/api/orders/${id}/review`),
    createReview: (id: number, payload: CreateDeliveryReviewRequest) =>
      request<DeliveryReview>(`/api/orders/${id}/review`, jsonBody(payload)),
  },

  carriers: {
    list: () => request<Carrier[]>("/api/carriers"),
    get: (id: number) => request<Carrier>(`/api/carriers/${id}`),
    create: (payload: CreateCarrierRequest) =>
      request<Carrier>("/api/carriers", jsonBody(payload)),
  },
};
