"use client";

import { useState, useEffect, useCallback } from "react";
import { toggleLike, isLiked, toggleBookmark, isBookmarked } from "@/lib/firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";

interface UsePoemActionsReturn {
  liked: boolean;
  bookmarked: boolean;
  isLiking: boolean;
  handleLike: () => Promise<void>;
  handleBookmark: () => Promise<void>;
  handleShare: (title: string, excerpt: string, url: string) => Promise<void>;
}

export function usePoemActions(poemId: string): UsePoemActionsReturn {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    Promise.all([
      isLiked(user.uid, poemId),
      isBookmarked(user.uid, poemId),
    ]).then(([likedStatus, bookmarkedStatus]) => {
      setLiked(likedStatus);
      setBookmarked(bookmarkedStatus);
    }).catch(console.error);
  }, [user, poemId]);

  const handleLike = useCallback(async () => {
    if (!user || isLiking) return;
    setIsLiking(true);
    try {
      const nowLiked = await toggleLike(poemId, user.uid);
      setLiked(nowLiked);
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pitiavana:", error);
    } finally {
      setIsLiking(false);
    }
  }, [user, poemId, isLiking]);

  const handleBookmark = useCallback(async () => {
    if (!user) {
      showToast("Midira aloha mba hitahirizana ny tononkalo", "error");
      return;
    }
    try {
      const status = await toggleBookmark(user.uid, poemId);
      setBookmarked(status);
      showToast(
        status ? "Voatahiry ao amin'ny tahirinao" : "Voaesotra tao amin'ny tahirinao",
        "success"
      );
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pitahirizana:", error);
    }
  }, [user, poemId, showToast]);

  const handleShare = useCallback(async (title: string, excerpt: string, url: string) => {
    const shareData = { title, text: excerpt, url };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Voatahiry ny rohy ao amin'ny presse-papier", "success");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(url);
        showToast("Voatahiry ny rohy ao amin'ny presse-papier", "success");
      }
    }
  }, [showToast]);

  return { liked, bookmarked, isLiking, handleLike, handleBookmark, handleShare };
}
