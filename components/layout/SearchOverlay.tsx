"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPoems } from "@/lib/firebase/firestore";
import { Poem } from "@/types";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      requestAnimationFrame(() => {
        setQuery("");
        setResults([]);
      });
    }
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await getPoems({ search: query, limit: 10 });
        setResults(data);
      } catch (error) {
        console.error("Fahadisoana teo am-pikarohana:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-surface/95 backdrop-blur-xl transition-all duration-300">
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-8">
        <span className="font-serif text-xl italic text-primary">Fikarohana</span>
        <button 
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-outline-variant/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[32px]">close</span>
        </button>
      </div>

      {/* Search Input Area */}
      <div className="mx-auto w-full max-w-4xl px-8 pt-12 md:pt-24">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Inona no tadiavinao? (lohateny, mpanoratra...)"
            className="w-full bg-transparent font-serif text-3xl md:text-5xl italic outline-none placeholder:text-outline-variant/30 text-primary border-b border-outline-variant/50 pb-6 focus:border-primary transition-colors"
          />
          {loading && (
            <div className="absolute right-0 bottom-8 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
        </div>

        {/* Results Section */}
        <div className="mt-12 overflow-y-auto pb-20 max-h-[60vh] scrollbar-hide">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {results.map((poem) => (
                <Link 
                  key={poem.id}
                  href={`/poem/${poem.id}`}
                  onClick={onClose}
                  className="group flex items-start gap-6 rounded-xl p-4 transition-all hover:bg-surface-container-low"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                    {poem.imageUrl ? (
                      <Image src={poem.imageUrl} alt={poem.title} fill className="object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-outline/30 text-4xl">ink_pen</span>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-serif text-2xl text-primary transition-colors group-hover:text-surface-tint">
                      {poem.title}
                    </h3>
                    <p className="font-sans text-xs font-bold uppercase tracking-widest text-outline">
                      {poem.authorName}
                    </p>
                    <p className="mt-2 line-clamp-1 font-serif italic text-on-surface-variant/60">
                      &quot;{poem.excerpt}&quot;
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-2xl italic text-on-surface-variant/40">
                Tsy misy sanganasa mifanaraka amin&apos;izany...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
                <h4 className="font-sans text-[10px] font-bold uppercase tracking-widest text-outline">Soso-kevitra</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Fitiavana", "Zava-boahary", "Alahelo", "Fanantenana"].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-4 py-2 rounded-full border border-outline-variant hover:border-primary hover:text-primary transition-colors font-serif italic"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Hint */}
      <div className="mt-auto border-t border-outline-variant/20 p-8 text-center">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-outline-variant">
          Tsindrio <span className="rounded bg-outline-variant/20 px-2 py-0.5 font-mono text-primary">ESC</span> raha hiala
        </p>
      </div>
    </div>
  );
}
