"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MoodChip from "@/components/ui/MoodChip";
import { getPoem, likePoem, toggleBookmark, isBookmarked } from "@/lib/firebase/firestore";
import { Poem } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import CommentSection from "@/components/poems/CommentSection";

export default function PoemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchPoem = async () => {
      try {
        const data = await getPoem(id);
        setPoem(data);
        if (user) {
          const bookmarkedStatus = await isBookmarked(user.uid, id);
          setBookmarked(bookmarkedStatus);
        }
      } catch (error) {
        console.error("Nisy fahadisoana teo am-pampidirana ny tononkalo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoem();
  }, [id, user]);

  const handleLike = async () => {
    if (!user || !poem || isLiking) return;
    setIsLiking(true);
    try {
      await likePoem(id, user.uid);
      setPoem({ ...poem, likesCount: (poem.likesCount || 0) + 1 });
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pitiavana:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (!user || !poem) return;
    try {
      const status = await toggleBookmark(user.uid, id);
      setBookmarked(status);
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pitahirizana:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface font-serif text-xl italic">
        Mampiditra ny andininy...
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface font-serif text-xl italic">
        Tahaka ny nanjavona tany anaty akon&apos;ny lasa ity tononkalo ity.
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col items-center pb-margin-page">
        {/* Hero Section Immersive */}
        {poem.imageUrl && (
          <section className="relative h-[40vh] w-full overflow-hidden md:h-[70vh]">
            <Image
              src={poem.imageUrl}
              alt={poem.title}
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
              <div className="mx-auto max-w-reading-column text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                  {poem.moods.map((mood) => (
                    <MoodChip key={mood} label={mood} className="bg-surface/80 backdrop-blur-sm" />
                  ))}
                </div>
                <h1 className="font-serif text-3xl font-medium tracking-tight text-primary md:text-7xl">
                  {poem.title}
                </h1>
              </div>
            </div>
          </section>
        )}

        <article className={`reading-container w-full px-4 md:px-gutter ${poem.imageUrl ? 'pt-8 md:pt-12' : 'py-8 md:py-12'}`}>
          {!poem.imageUrl && (
            <header className="mb-10 md:mb-16 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                {poem.moods.map((mood) => (
                  <MoodChip key={mood} label={mood} className="scale-90" />
                ))}
              </div>
              <h1 className="mb-6 md:mb-8 font-serif text-3xl font-medium tracking-tight text-primary md:text-6xl">
                {poem.title}
              </h1>
            </header>
          )}

          <div className="mb-16 flex items-center justify-center gap-4 border-b border-outline-variant/20 pb-8">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-outline-variant bg-surface-container">
              {poem.authorImage ? (
                <Image src={poem.authorImage} alt={poem.authorName} fill className="object-cover grayscale" />
              ) : (
                <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-outline text-3xl">
                  account_circle
                </span>
              )}
            </div>
            <div className="text-left">
              <span className="block font-sans text-sm font-semibold uppercase tracking-widest text-primary">
                {poem.authorName}
              </span>
              <span className="block font-sans text-xs text-on-surface-variant/60">
                {poem.createdAt && 
                  (() => {
                    const date = poem.createdAt as unknown;
                    if (typeof date === 'object' && date !== null && 'seconds' in date) {
                      return new Date((date as { seconds: number }).seconds * 1000).toLocaleDateString("mg-MG", { day: "numeric", month: "long", year: "numeric" });
                    }
                    return "Tselatry ny mandrakizay";
                  })()
                }
              </span>
            </div>
          </div>

          <div 
            className="ProseMirror text-center"
            dangerouslySetInnerHTML={{ __html: poem.content }}
          />

          <footer className="mt-20 border-t border-outline-variant/30 pt-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button 
                  onClick={handleLike}
                  disabled={isLiking || !user}
                  className={`flex items-center gap-2 transition-colors hover:text-primary ${isLiking ? "opacity-50" : "text-on-surface-variant"}`}
                >
                  <span className="material-symbols-outlined text-[24px]">water_drop</span>
                  <span className="font-sans text-sm font-medium">{poem.likesCount}</span>
                </button>
                <button className="flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary">
                  <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
                  <span className="font-sans text-sm font-medium">{poem.commentsCount}</span>
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBookmark}
                  disabled={!user}
                  className={`transition-colors hover:text-primary ${bookmarked ? "text-primary" : "text-on-surface-variant"}`}
                  title="Hampidirina ao amin'ny tahiry"
                >
                  <span className={`material-symbols-outlined text-[24px] ${bookmarked ? "fill-1" : ""}`}>
                    {bookmarked ? "bookmark" : "bookmark_border"}
                  </span>
                </button>
                <button className="text-on-surface-variant transition-colors hover:text-primary">
                  <span className="material-symbols-outlined text-[24px]">ios_share</span>
                </button>
              </div>
            </div>
          </footer>

          <CommentSection poemId={id} />
        </article>
      </main>
      <Footer />
    </>
  );
}
