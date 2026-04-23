"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PoemCard from "@/components/poems/PoemCard";
import MoodChip from "@/components/ui/MoodChip";
import { getPoems } from "@/lib/firebase/firestore";
import { Poem } from "@/types";

export default function ArchivePage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMood, setActiveMood] = useState("Rehetra");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchArchive = async () => {
      setLoading(true);
      try {
        const filter: { mood?: string; search?: string } = activeMood !== "Rehetra" ? { mood: activeMood } : {};
        if (searchTerm) filter.search = searchTerm;
        const data = await getPoems({ ...filter, limit: 20 });
        setPoems(data);
      } catch (error) {
        console.error("Nisy fahadisoana teo am-pampidirana ny tahiry:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchArchive();
    }, 500);

    return () => clearTimeout(timer);
  }, [activeMood, searchTerm]);

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-8 py-16">
        <section className="mx-auto flex w-full max-w-reading-column flex-col items-center gap-8 text-center">
          <h1 className="font-serif text-5xl tracking-tight text-primary">Ny Tahiry</h1>
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
              placeholder="Hikaroka amin&apos;ny alalan&apos;ny lohateny, mpanoratra na eritreritra..."
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
          <div className="py-20 text-center font-serif text-xl italic text-on-surface-variant/60">Manokatra ny boky...</div>
        ) : poems.length > 0 ? (
          <section className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
            {poems.map((poem) => (
              <PoemCard 
                key={poem.id} 
                id={poem.id}
                title={poem.title}
                author={poem.authorName}
                excerpt={poem.excerpt}
                moods={poem.moods}
                likesCount={poem.likesCount}
                imageUrl={poem.imageUrl}
              />
            ))}
          </section>
        ) : (
          <div className="py-20 text-center font-serif text-xl italic text-on-surface-variant/40">Mbola foana ny tahiry.</div>
        )}

        {poems.length > 0 && (
          <div className="flex justify-center">
            <button className="rounded border border-outline-variant px-8 py-4 font-sans text-sm font-semibold uppercase tracking-widest text-primary transition-colors hover:border-primary">
              Hampiditra andininy hafa
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
