"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setOrders(await api.orders.list());
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Erro ao carregar pedidos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    api.orders
      .list()
      .then((data) => {
        if (isActive) {
          setOrders(data);
          setError(null);
        }
      })
      .catch((exception) => {
        if (isActive) {
          setError(exception instanceof Error ? exception.message : "Erro ao carregar pedidos.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { orders, isLoading, error, refresh };
}
