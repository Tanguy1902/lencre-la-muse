"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getPoemsPaginated, PoemQueryResult } from "@/lib/firebase/firestore";
import { Poem } from "@/types";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

interface UsePoemsOptions {
  mood?: string;
  authorId?: string;
  status?: "published" | "draft";
  limit?: number;
  search?: string;
  enabled?: boolean;
}

interface UsePoemsReturn {
  poems: Poem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePoems(options: UsePoemsOptions = {}): UsePoemsReturn {
  const { mood, authorId, status, limit = 10, search, enabled = true } = options;
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  const fetchPoems = useCallback(async (isLoadMore = false) => {
    if (!enabled) return;
    
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      lastDocRef.current = null;
    }

    try {
      const filter: Parameters<typeof getPoemsPaginated>[0] = {
        limit,
        ...(mood && mood !== "Ny tononkalo rehetra" && mood !== "Rehetra" ? { mood } : {}),
        ...(authorId ? { authorId } : {}),
        ...(status ? { status } : {}),
        ...(search ? { search } : {}),
        ...(isLoadMore && lastDocRef.current ? { lastDoc: lastDocRef.current } : {}),
      };

      const result: PoemQueryResult = await getPoemsPaginated(filter);
      
      lastDocRef.current = result.lastDoc;
      setHasMore(result.hasMore);

      if (isLoadMore) {
        setPoems(prev => [...prev, ...result.poems]);
      } else {
        setPoems(result.poems);
      }
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pampidirana ny tononkalo:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [mood, authorId, status, limit, search, enabled]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPoems(false);
    }, search ? 400 : 0);

    return () => clearTimeout(timer);
  }, [fetchPoems]);

  const loadMore = useCallback(async () => {
    if (!loadingMore && hasMore) {
      await fetchPoems(true);
    }
  }, [fetchPoems, loadingMore, hasMore]);

  const refresh = useCallback(async () => {
    await fetchPoems(false);
  }, [fetchPoems]);

  return { poems, loading, loadingMore, hasMore, loadMore, refresh };
}
