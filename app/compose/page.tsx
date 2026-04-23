"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import MoodChip from "@/components/ui/MoodChip";

export default function ComposePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");

  return (
    <>
      <Header />
      <main className="flex grow justify-center px-gutter py-margin-page bg-surface">
        <div className="relative w-full max-w-reading-column overflow-hidden rounded-xl border border-surface-variant bg-surface-container-lowest p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] md:p-12">
          {/* Background Texture Suggestion */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-surface/50 to-transparent" />
          
          <form className="relative z-10 flex flex-col space-y-12">
            <header className="mb-4 text-center space-y-2">
              <h1 className="font-serif text-4xl font-medium text-primary">Hanoratra andininy</h1>
              <p className="font-sans text-sm text-on-surface-variant">Miandry ny teninao ny toerana masina.</p>
            </header>

            <div className="space-y-10">
              {/* Titre du poème */}
              <div className="group relative">
                <input
                  type="text"
                  placeholder="Sanganasa tsy misy lohateny"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-0 border-b border-outline-variant bg-transparent pb-4 text-center font-serif text-5xl tracking-tight text-primary outline-none transition-colors focus:border-primary placeholder:text-outline-variant/30"
                />
              </div>

              {/* Contenu du poème */}
              <div className="mt-8 group relative">
                <textarea
                  placeholder="Andininy, bitsika na ako..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container/30 p-6 text-center font-serif text-xl leading-relaxed text-primary outline-none transition-all focus:border-primary focus:bg-surface-container-lowest placeholder:text-outline-variant/40"
                />
              </div>
            </div>

            {/* Section Métadonnées */}
            <div className="grid grid-cols-1 gap-8 border-t border-outline-variant pt-8 md:grid-cols-2">
              {/* Ambiances */}
              <div className="space-y-4">
                <label className="block font-sans text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
                  Fihetseham-po
                </label>
                <div className="flex flex-wrap gap-2">
                  <MoodChip label="Alahelo" />
                  <MoodChip label="Zava-boahary" isActive />
                  <MoodChip label="An-tanàn-dehibe" />
                  <MoodChip label="Fitiavana" />
                  <button className="flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1.5 font-sans text-[10px] font-medium text-on-surface transition-colors hover:border-primary hover:bg-surface-container">
                    <span className="material-symbols-outlined text-[14px]">add</span> Hanampy
                  </button>
                </div>
              </div>

              {/* Collection & Visibilité */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
                    Andiany
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded border border-outline-variant bg-surface-container-lowest py-2.5 pl-4 pr-10 font-sans text-sm text-primary outline-none focus:border-primary">
                      <option>Eritreritra misasakalina (vakiraoka)</option>
                      <option>Andiany Ravin-kazo latsaka</option>
                      <option>Hamorona andiany vaovao...</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-sans text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
                    Fahitana
                  </label>
                  <div className="flex rounded border border-outline-variant bg-surface-container-low p-1">
                    {[
                      { id: "public", label: "Ny rehetra" },
                      { id: "subs", label: "Mpanaraka" },
                      { id: "private", label: "Izaho ihany" }
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVisibility(v.id)}
                        className={`flex flex-1 items-center justify-center gap-1 rounded py-1.5 px-3 font-sans text-[10px] transition-all ${
                          visibility === v.id
                            ? "bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/50"
                            : "text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {v.id === "public" ? "public" : v.id === "subs" ? "group" : "lock"}
                        </span>
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pied d'action */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
              <Button variant="secondary" className="w-full sm:w-auto flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">bookmark</span> Hitehirizana ny vakiraoka
              </Button>
              <Button variant="primary" className="w-full sm:w-auto flex items-center gap-2">
                Haparitaka ny andininy <span className="material-symbols-outlined text-[18px]">send</span>
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
