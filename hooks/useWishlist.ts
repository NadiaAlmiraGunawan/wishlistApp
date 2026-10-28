"use client";

import { useCallback, useEffect, useState } from "react";
import type { Wishlist } from "@/lib/types";

export interface FilterState {
  search: string;
  category: string;
  priority: string;
  status: string;
  sort: "newest" | "oldest" | "priority";
}

export function useWishlist(filters: FilterState) {
  const [data, setData] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.priority) params.set("priority", filters.priority);
      if (filters.status) params.set("status", filters.status);
      if (filters.sort) params.set("sort", filters.sort);

      // Endpoint disesuaikan dengan struktur: /api/routes
      const res = await fetch(`/api/routes?${params.toString()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal memuat data.");
      }
      setData(json.data as Wishlist[]);
    } catch (e: any) {
      setError(e.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.category,
    filters.priority,
    filters.status,
    filters.sort,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}