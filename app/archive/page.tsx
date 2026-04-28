"use client";

import { useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PoemCard from "@/components/poems/PoemCard";
import MoodChip from "@/components/ui/MoodChip";
import Button from "@/components/ui/Button";
import PoemCardSkeleton from "@/components/poems/PoemCardSkeleton";
import { usePoems } from "@/hooks/usePoems";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useState } from "react";

export default function ArchivePage() {
  const [activeMood, setActiveMood] = useState("Rehetra");
  const [searchTerm, setSearchTerm] = useState("");

  const { poems, loading, loadingMore, hasMore, loadMore } = usePoems({
    mood: activeMood !== "Rehetra" ? activeMood : undefined,
    search: searchTerm || undefined,
    limit: 12,
  });

  const poemIds = useMemo(() => poems.map(p => p.id), [poems]);
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks(poemIds);

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 md:px-8 py-8 md:py-16">
        <section className="mx-auto flex w-full max-w-reading-column flex-col items-center gap-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-primary">Ny Tahiry</h1>
          <p className="font-serif text-xl italic text-on-surface-variant/80">
            Hikaroka andininy, bitsika ary akon&apos;ny lasa.
          </p>
          
          <div className="group relative w-full mt-4">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant text-[24px] group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hikaroka amin'ny alalan'ny lohateny, mpanoratra na eritreritra..."
              className="w-full border-b border-outline-variant bg-transparent py-4 pl-10 pr-4 font-serif text-lg italic outline-none transition-all focus:border-primary placeholder:text-on-surface-variant/40"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button className="flex items-center gap-2 rounded-full border border-outline-variant px-4 py-2 font-sans text-[12px] font-medium uppercase tracking-widest text-on-surface-variant hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Sivana
            </button>
            <div className="mx-2 h-8 w-px bg-outline-variant/30" />
            <MoodChip label="Rehetra" isActive={activeMood === "Rehetra"} onClick={() => setActiveMood("Rehetra")} />
            <MoodChip label="Alahelo" isActive={activeMood === "Alahelo"} onClick={() => setActiveMood("Alahelo")} />
            <MoodChip label="Zava-boahary" isActive={activeMood === "Zava-boahary"} onClick={() => setActiveMood("Zava-boahary")} />
            <MoodChip label="An-tanàn-dehibe" isActive={activeMood === "An-tanàn-dehibe"} onClick={() => setActiveMood("An-tanàn-dehibe")} />
            <MoodChip label="Fifaliana" isActive={activeMood === "Fifaliana"} onClick={() => setActiveMood("Fifaliana")} />
          </div>
        </section>

        {loading ? (
          <section className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <PoemCardSkeleton key={i} />)}
          </section>
        ) : poems.length > 0 ? (
          <section className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
            {poems.map((poem) => (
              <PoemCard 
                key={poem.id} 
                id={poem.id}
                title={poem.title}
                author={poem.authorName}
                authorId={poem.authorId}
                excerpt={poem.excerpt}
                moods={poem.moods}
                likesCount={poem.likesCount}
                imageUrl={poem.imageUrl}
                isBookmarked={isBookmarked(poem.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </section>
        ) : (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant/20">library_books</span>
            <p className="font-serif text-xl italic text-on-surface-variant/40">Mbola foana ny tahiry.</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="font-sans text-sm text-primary hover:underline"
              >
                Hanadio ny fikarohana
              </button>
            )}
          </div>
        )}

        {/* Load More */}
        {poems.length > 0 && (
          <div className="flex justify-center">
            {hasMore ? (
              <Button 
                variant="secondary"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-2 text-[18px]">progress_activity</span>
                    Mampiditra...
                  </>
                ) : (
                  "Hampiditra andininy hafa"
                )}
              </Button>
            ) : (
              <p className="font-serif text-sm italic text-on-surface-variant/40">
                Ireo rehetra no andininy ao amin&apos;ny tahiry.
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
