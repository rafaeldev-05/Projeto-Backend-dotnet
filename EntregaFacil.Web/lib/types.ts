export type OrderStatus =
  | "AwaitingSeparation"
  | "InSeparation"
  | "ReadyForShipping"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type DeliveryOccurrenceType =
  | "AddressNotFound"
  | "RecipientAbsent"
  | "DeliveryDelayed"
  | "DamagedPackage"
  | "Other";

export type Product = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  price: number;
  stockQuantity: number;
};

export type CreateProductRequest = Omit<Product, "id">;
export type UpdateProductRequest = CreateProductRequest;

export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type Order = {
  id: number;
  number: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
};

export type CreateOrderRequest = {
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
};

export type Carrier = {
  id: number;
  name: string;
  cnpj: string;
  phone?: string | null;
};

export type CreateCarrierRequest = Omit<Carrier, "id">;

export type ShipOrderRequest = {
  carrierId: number;
  trackingCode: string;
  shippingDate: string;
};

export type Shipment = {
  id: number;
  orderId: number;
  carrierId: number;
  carrierName: string;
  trackingCode: string;
  shippingDate: string;
  deliveryDate?: string | null;
};

export type DeliveryOccurrence = {
  id: number;
  orderId: number;
  date: string;
  type: DeliveryOccurrenceType;
  description: string;
};

export type CreateDeliveryOccurrenceRequest = {
  type: DeliveryOccurrenceType;
  description: string;
};

export type DeliveryReview = {
  id: number;
  orderId: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
};

export type CreateDeliveryReviewRequest = {
  rating: number;
  comment?: string | null;
};
