"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PoemOfDay from "@/components/poems/PoemOfDay";
import PoemCard from "@/components/poems/PoemCard";
import MoodChip from "@/components/ui/MoodChip";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { getPoems } from "@/lib/firebase/firestore";
import { Poem } from "@/types";
import PoemCardSkeleton from "@/components/poems/PoemCardSkeleton";

export default function DiscoverPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [poemOfDay, setPoemOfDay] = useState<Poem | null>(null);
  const [activeMood, setActiveMood] = useState("Ny tononkalo rehetra");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const filter: { mood?: string; search?: string } = activeMood !== "Ny tononkalo rehetra" ? { mood: activeMood } : {};
        if (searchTerm) filter.search = searchTerm;
        const allPoems = await getPoems({ ...filter, limit: 10 });
        setPoems(allPoems);
        if (allPoems.length > 0 && activeMood === "Ny tononkalo rehetra" && !searchTerm) {
          setPoemOfDay(allPoems[0]);
        } else {
          setPoemOfDay(null);
        }
      } catch (error) {
        console.error("Nisy fahadisoana teo am-pampidirana ny tononkalo:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchAllData();
    }, searchTerm ? 400 : 0);

    return () => clearTimeout(timer);
  }, [activeMood, searchTerm]);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 md:px-8 py-8 md:py-12">
        {loading ? (
          <div className="mb-12 md:mb-20">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        ) : poemOfDay && activeMood === "Ny tononkalo rehetra" && !searchTerm ? (
          <PoemOfDay 
            id={poemOfDay.id}
            title={poemOfDay.title}
            author={poemOfDay.authorName}
            authorImage={poemOfDay.authorImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuDQr5MRfvBQd0jamm5wO6SPu81JuwWzwen6-ChnrqolIZl7kUAWp1IyVd3gli5ctjcmvyYnR_Pccl3cl36R_QUURVvWBNG1XAzmv0PY5IZc-zitqRfVhPmA5YMpecoXDnRxOGQeujPzeEvLzI6R-I5MrylTX95A3tgM5XvETLhvvGahIUkxeCGRYaRFrGhuZkoGpxYOVKuD3UqsJ6gvgVMEPVBsMNfVllhkl1EyqVNlJHNdns8gDBYWu-lQxH-8E_awyhfZCpMFUUI"}
            excerpt={poemOfDay.excerpt}
            imageUrl={poemOfDay.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDDK0wMJ7rDFWkPqZT0hYpIy3aUTKccQScMgA33wYPS06g35yzkrdIpP6CQG8GhaOirCA5Aw1niDO3VOk9jTmTPTPWLWGqw8P4UtbVn6HI8A2Vi9sAMP1aFOsfTwy3h6M1ppcYW_nZU3X7DgAs7lctkY_9rWxFmPOyeEeJVs32OdkK2jDaA1-iwBXdItZpG-aXdhlT-E8UlbIzjKtekvwE7k227HuRJJqwpRq79C-kGE_8VB7Fejua4tKKgFLhiK7vHThgg_UUzX1Q"}
          />
        ) : !loading && activeMood === "Ny tononkalo rehetra" && !searchTerm && poems.length === 0 && (
          <div className="mb-12 md:mb-20 rounded-xl border border-outline-variant bg-surface-container-low p-6 md:p-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl italic text-primary">Mbola tsy misy tononkalo aloha hatreto</h2>
            <p className="mt-4 font-sans text-sm md:text-base text-on-surface-variant">Aoka ianao no ho voalohany hametraka penina eo amin&apos;ny taratasy.</p>
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
              />
            ))}
          </section>
        ) : (
          <div className="py-20 text-center font-serif text-xl italic text-on-surface-variant/40">Tsy misy tononkalo hita.</div>
        )}

        {poems.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link href="/archive">
              <Button variant="secondary" className="group">
                Hijery pejy hafa
                <span className="material-symbols-outlined ml-2 text-[18px] transition-transform group-hover:translate-y-1">
                  expand_more
                </span>
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
