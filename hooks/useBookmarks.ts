"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getBookmarkStatuses, toggleBookmark } from "@/lib/firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";

interface UseBookmarksReturn {
  bookmarks: Record<string, boolean>;
  isBookmarked: (poemId: string) => boolean;
  toggle: (poemId: string) => Promise<void>;
}

export function useBookmarks(poemIds: string[]): UseBookmarksReturn {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const cancelledRef = useRef(false);

  const poemIdsKey = poemIds.join(",");

  useEffect(() => {
    cancelledRef.current = false;

    if (!user || poemIds.length === 0) {
      return;
    }

    getBookmarkStatuses(user.uid, poemIds).then(
      (statuses) => {
        if (!cancelledRef.current) setBookmarks(statuses);
      },
      (error) => {
        console.error("Fahadisoana teo am-pitahirizana:", error);
      }
    );

    return () => { cancelledRef.current = true; };
  }, [user, poemIdsKey]);

  const isBookmarkedFn = useCallback((poemId: string) => {
    return !!bookmarks[poemId];
  }, [bookmarks]);

  const toggle = useCallback(async (poemId: string) => {
    if (!user) {
      showToast("Midira aloha mba hitahirizana ny tononkalo", "error");
      return;
    }

    try {
      const status = await toggleBookmark(user.uid, poemId);
      setBookmarks(prev => ({ ...prev, [poemId]: status }));
      showToast(
        status ? "Voatahiry ao amin'ny tahirinao" : "Voaesotra tao amin'ny tahirinao",
        "success"
      );
    } catch (error) {
      console.error("Fahadisoana teo am-pitahirizana:", error);
      showToast("Nisy fahadisoana teo am-pitahirizana", "error");
    }
  }, [user, showToast]);

  return { bookmarks, isBookmarked: isBookmarkedFn, toggle };
}
