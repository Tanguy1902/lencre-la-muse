"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PoemOfDay from "@/components/poems/PoemOfDay";
import PoemCard from "@/components/poems/PoemCard";
import MoodChip from "@/components/ui/MoodChip";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { getPoemOfDay } from "@/lib/firebase/firestore";
import { Poem } from "@/types";
import PoemCardSkeleton from "@/components/poems/PoemCardSkeleton";
import { usePoems } from "@/hooks/usePoems";
import { useBookmarks } from "@/hooks/useBookmarks";

export default function DiscoverPage() {
  const [poemOfDay, setPoemOfDay] = useState<Poem | null>(null);
  const [loadingPOD, setLoadingPOD] = useState(true);
  const [activeMood, setActiveMood] = useState("Ny tononkalo rehetra");
  const [searchTerm, setSearchTerm] = useState("");

  const { poems, loading, loadingMore, hasMore, loadMore } = usePoems({
    mood: activeMood !== "Ny tononkalo rehetra" ? activeMood : undefined,
    search: searchTerm || undefined,
    limit: 9,
  });

  // Batch bookmark check for all visible poems
  const poemIds = useMemo(() => poems.map(p => p.id), [poems]);
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks(poemIds);

  useEffect(() => {
    const fetchPOD = async () => {
      try {
        const pod = await getPoemOfDay();
        setPoemOfDay(pod);
      } catch (error) {
        console.error("Nisy fahadisoana teo am-pampidirana ny tononkalo anio:", error);
      } finally {
        setLoadingPOD(false);
      }
    };
    fetchPOD();
  }, []);

  const showPOD = activeMood === "Ny tononkalo rehetra" && !searchTerm;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 md:px-8 py-8 md:py-12">
        {loadingPOD && showPOD ? (
          <div className="mb-12 md:mb-20">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        ) : poemOfDay && showPOD ? (
          <PoemOfDay 
            id={poemOfDay.id}
            title={poemOfDay.title}
            author={poemOfDay.authorName}
            authorImage={poemOfDay.authorImage || ""}
            excerpt={poemOfDay.excerpt}
            imageUrl={poemOfDay.imageUrl || ""}
          />
        ) : !loadingPOD && showPOD && poems.length === 0 && (
          <div className="mb-12 md:mb-20 rounded-xl border border-outline-variant bg-surface-container-low p-6 md:p-12 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-outline-variant/30">ink_pen</span>
            <h2 className="font-serif text-2xl md:text-3xl italic text-primary">Mbola tsy misy tononkalo aloha hatreto</h2>
            <p className="mt-4 font-sans text-sm md:text-base text-on-surface-variant">Aoka ianao no ho voalohany hametraka penina eo amin&apos;ny taratasy.</p>
            <Link href="/write" className="mt-6 inline-block">
              <Button variant="primary">Hanorata ny voalohany</Button>
            </Link>
          </div>
        )}

        {/* Section de filtrage */}
        <section className="mb-10 md:mb-16 flex flex-col items-start justify-between gap-8 border-b border-outline-variant pb-6 lg:flex-row lg:items-end">
          <div className="w-full lg:w-1/3">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hikaroka fihetseham-po, teny..."
                className="w-full border-b border-outline-variant bg-transparent py-3 pl-8 pr-4 font-sans text-sm outline-none transition-all focus:border-primary placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>

          <div className="flex w-full overflow-x-auto pb-2 scrollbar-hide lg:w-auto lg:overflow-visible lg:pb-0">
            <div className="flex flex-nowrap gap-3 lg:flex-wrap">
              <MoodChip 
                label="Ny tononkalo rehetra" 
                isActive={activeMood === "Ny tononkalo rehetra"} 
                onClick={() => setActiveMood("Ny tononkalo rehetra")}
              />
              <MoodChip 
                label="Alahelo" 
                isActive={activeMood === "Alahelo"} 
                onClick={() => setActiveMood("Alahelo")}
              />
              <MoodChip 
                label="Zava-boahary" 
                isActive={activeMood === "Zava-boahary"} 
                onClick={() => setActiveMood("Zava-boahary")}
              />
              <MoodChip 
                label="Saintsainina" 
                isActive={activeMood === "Saintsainina"} 
                onClick={() => setActiveMood("Saintsainina")}
              />
              <Link 
                href="/archive"
                className="flex shrink-0 items-center gap-1 rounded-full border border-outline-variant px-5 py-2 font-sans text-[12px] font-medium uppercase tracking-wider transition-colors hover:bg-surface-container"
              >
                Hafa
                <span className="material-symbols-outlined text-[16px]">tune</span>
              </Link>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
             {[1, 2, 3, 4, 5, 6].map((i) => <PoemCardSkeleton key={i} />)}
          </section>
        ) : poems.length > 0 ? (
          /* Grille Masonry */
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
            <span className="material-symbols-outlined text-6xl text-outline-variant/20">search_off</span>
            <p className="font-serif text-xl italic text-on-surface-variant/40">Tsy misy tononkalo hita.</p>
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

        {/* Load More / Pagination */}
        {poems.length > 0 && (
          <div className="mt-16 flex justify-center">
            {hasMore ? (
              <Button 
                variant="secondary" 
                className="group"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-2 text-[18px]">progress_activity</span>
                    Mampiditra...
                  </>
                ) : (
                  <>
                    Hijery pejy hafa
                    <span className="material-symbols-outlined ml-2 text-[18px] transition-transform group-hover:translate-y-1">
                      expand_more
                    </span>
                  </>
                )}
              </Button>
            ) : (
              <p className="font-serif text-sm italic text-on-surface-variant/40">
                Ireo rehetra no tononkalo hita.
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
