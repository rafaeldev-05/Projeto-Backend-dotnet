"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Carrier } from "@/lib/types";

export function useCarriers() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCarriers(await api.carriers.list());
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Erro ao carregar transportadoras.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    api.carriers
      .list()
      .then((data) => {
        if (isActive) {
          setCarriers(data);
          setError(null);
        }
      })
      .catch((exception) => {
        if (isActive) {
          setError(exception instanceof Error ? exception.message : "Erro ao carregar transportadoras.");
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

  return { carriers, isLoading, error, refresh };
}
