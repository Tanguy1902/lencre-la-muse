"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { toggleBookmark, isBookmarked as checkBookmark } from "@/lib/firebase/firestore";

interface PoemCardProps {
  id: string;
  title: string;
  author: string;
  authorId: string;
  excerpt: string;
  moods: string[];
  likesCount: number;
  imageUrl?: string;
  showDeleteButton?: boolean;
  onDelete?: (id: string) => void;
}

export default function PoemCard({
  id,
  title,
  author,
  authorId,
  excerpt,
  moods,
  likesCount,
  imageUrl,
  showDeleteButton = false,
  onDelete,
}: PoemCardProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkBookmark(user.uid, id).then(setBookmarked);
    }
  }, [id, user]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast("Midira aloha mba hitahirizana ny tononkalo", "error");
      return;
    }
    
    setIsActionLoading(true);
    try {
      const status = await toggleBookmark(user.uid, id);
      setBookmarked(status);
      showToast(
        status ? "Voatahiry ao amin'ny tahirinao" : "Voaesotra tao amin'ny tahirinao",
        "success"
      );
    } catch (error) {
      console.error("Fahadisoana teo am-pitahirizana:", error);
      showToast("Nisy fahadisoana teo am-pitahirizana", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareData = {
      title,
      text: excerpt,
      url: `${window.location.origin}/poem/${id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showToast("Voatahiry ny rohy ao amin'ny presse-papier", "success");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(shareData.url);
        showToast("Voatahiry ny rohy ao amin'ny presse-papier", "success");
      }
    }
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-outline-variant bg-surface-container-lowest transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
      {/* Image Container */}
      <Link href={`/poem/${id}`} className="relative aspect-4/3 overflow-hidden bg-surface-container">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center opacity-20">
            <span className="material-symbols-outlined text-6xl">ink_pen</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="absolute bottom-4 left-4 flex gap-2">
          {moods.slice(0, 1).map((mood) => (
            <span
              key={mood}
              className="rounded-full bg-white/20 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md"
            >
              {mood}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <Link href={`/poem/${id}`}>
              <h2 className="font-serif text-2xl font-medium text-primary transition-colors group-hover:text-surface-tint">
                {title}
              </h2>
            </Link>
            <Link 
              href={`/profile/${authorId}`} 
              className="font-sans text-[11px] font-bold uppercase tracking-widest text-outline transition-colors hover:text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {author}
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {showDeleteButton && onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                className="text-outline transition-colors hover:text-red-600 p-2"
                title="Hamafa"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            )}
            <button 
              onClick={handleBookmark}
              disabled={isActionLoading}
              className={`transition-colors p-2 ${bookmarked ? "text-primary" : "text-outline hover:text-primary"}`}
              title={bookmarked ? "Esorina ao amin'ny tahiry" : "Hampidirina ao amin'ny tahiry"}
            >
              <span className={`material-symbols-outlined text-[20px] ${bookmarked ? "fill-1" : ""}`}>
                {bookmarked ? "bookmark" : "bookmark_border"}
              </span>
            </button>
          </div>
        </div>

        <div className="mb-6 flex-1 font-serif text-lg leading-relaxed text-on-surface-variant/80 italic line-clamp-3">
          &quot;{excerpt}&quot;
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-outline-variant/30 pt-4">
          <Link 
            href={`/poem/${id}`}
            className="font-sans text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
          >
            Hijery
          </Link>
          <div className="flex items-center gap-4 text-outline">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
              <span className="font-sans text-[10px]">{likesCount}</span>
            </div>
            <button 
              onClick={handleShare}
              className="transition-colors hover:text-primary p-2"
              title="Hizara"
            >
              <span className="material-symbols-outlined text-[18px]">ios_share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
