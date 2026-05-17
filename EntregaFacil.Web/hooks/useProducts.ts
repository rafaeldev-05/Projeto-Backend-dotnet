"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProducts(await api.products.list());
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Erro ao carregar produtos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    api.products
      .list()
      .then((data) => {
        if (isActive) {
          setProducts(data);
          setError(null);
        }
      })
      .catch((exception) => {
        if (isActive) {
          setError(exception instanceof Error ? exception.message : "Erro ao carregar produtos.");
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

  return { products, isLoading, error, refresh };
}
