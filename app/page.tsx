"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { getPoems } from "@/lib/firebase/firestore";
import { Poem } from "@/types";
import PoemCardSkeleton from "@/components/poems/PoemCardSkeleton";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();
  return (
    <div 
      ref={ref} 
      className={`reveal ${isVisible ? "revealed" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [recentPoems, setRecentPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getPoems({ limit: 3 });
        setRecentPoems(data);
      } catch (error) {
        console.error("Fahadisoana teo am-pampidirana ny tononkalo farany:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative flex h-[85vh] w-full items-center justify-center overflow-hidden">
          <Image
            src="/landing_hero_bg_v2_1776963226690.png"
            alt="Toerana masina hanoratana"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/40 to-background" />
          
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <h1 className="mb-6 font-serif text-5xl font-medium tracking-tight text-primary md:text-8xl reveal revealed" style={{ transitionDelay: "200ms" }}>
              Toerana iainan&apos;ny teny.
            </h1>
            <p className="mx-auto mb-10 max-w-2xl font-serif text-xl italic leading-relaxed text-on-surface-variant/80 md:text-2xl reveal revealed" style={{ transitionDelay: "400ms" }}>
              Tranokala natokana ho an&apos;ny tononkalo. Manorata malalaka ampiano ny ainga, vakio amim-panajana, ary miaraha amin&apos;ny fianakaviambe manome lanja ny kanton&apos;ny rima sy ny voambolana.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row reveal revealed" style={{ transitionDelay: "600ms" }}>
              <Link href="/auth/register">
                <Button variant="primary" className="px-10 py-5 text-base">
                  Hanomboka ny dia
                </Button>
              </Link>
              <Link href="/discover">
                <Button variant="secondary" className="px-10 py-5 text-base">
                  Hijery ny kanto
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature: Gallery */}
        <RevealSection>
          <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 py-24 md:grid-cols-2 md:px-8">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-outline-variant/30 shadow-2xl">
              <Image
                src="/landing_gallery_art_1776962950971.png"
                alt="Galerian'ny Kanto Literatiora"
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 transition-opacity hover:opacity-0" />
              <div className="absolute bottom-8 left-8">
                <p className="font-serif text-lg italic text-white drop-shadow-md">Ny kanton&apos;ny fampirantiana</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_stories</span>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant">Fikarohana</span>
              </div>
              <h2 className="font-serif text-4xl font-medium text-primary md:text-5xl">Tahiry kanton&apos;ny Literatiora</h2>
              <p className="font-serif text-xl leading-relaxed text-on-surface-variant/70">
                Hitanao ato ireo sangan&apos;asa, vokatry ny ainga ka nosoratan&apos;ny penin&apos;ireo mpanoratra. Mankafiza finaritra ny kanton&apos;ny Teny.
              </p>
              <Link href="/discover" className="group flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-primary">
                Hijery ny sanganasa
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </section>
        </RevealSection>

        {/* Feature: Sanctuary */}
        <RevealSection>
          <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 py-24 md:grid-cols-2 md:px-8">
            <div className="order-2 flex flex-col gap-6 md:order-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant">Famoronana</span>
              </div>
              <h2 className="font-serif text-4xl font-medium text-primary md:text-5xl">Asehoy ny ainga ao anatinao</h2>
              <p className="font-serif text-xl leading-relaxed text-on-surface-variant/70">
                Ianao no sisa andrasana fa ny penina efa vonona. Efa vonona hamoaka izay fihetseham-po vokatry ny ainga ao anatinao. Ka tonio ny fo dia andeha manorata.
              </p>
              <Link href="/write" className="group flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-primary">
                Handray ny penina
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
            <div className="relative order-1 aspect-square overflow-hidden rounded-xl border border-outline-variant/30 shadow-2xl md:order-2">
              <Image
                src="/landing_sanctuary_mockup_1776963172717.png"
                alt="Ny Toerana Masina Hanoratana"
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>
          </section>
        </RevealSection>

        {/* Recent Poems Section */}
        <RevealSection>
          <section className="bg-surface-container-low/50 py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <header className="mb-16 text-center">
                <h2 className="mb-4 font-serif text-4xl font-medium text-primary md:text-5xl">Sanganasa vao nivoaka</h2>
                <p className="font-serif text-xl italic text-on-surface-variant/60">Ireo bitsika vao voangona tao amin&apos;ny tahirinay.</p>
              </header>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {loading ? (
                  [1, 2, 3].map((i) => <PoemCardSkeleton key={i} />)
                ) : recentPoems.length > 0 ? (
                  recentPoems.map((poem, index) => (
                    <Link 
                      key={poem.id}
                      href={`/poem/${poem.id}`}
                      className="group flex h-full flex-col border border-outline-variant bg-surface-container-lowest p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl reveal revealed"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <h3 className="mb-4 font-serif text-2xl text-primary transition-colors group-hover:text-surface-tint">
                        {poem.title}
                      </h3>
                      <p className="mb-8 flex-1 font-serif text-lg italic leading-relaxed text-on-surface-variant/70 line-clamp-4">
                        &quot;{poem.excerpt}&quot;
                      </p>
                      <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4">
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-outline">Nataon&apos;i {poem.authorName}</span>
                        <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">water_drop</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 flex flex-col items-center gap-6 py-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-outline-variant/30">ink_pen</span>
                    <p className="font-serif text-xl italic text-on-surface-variant/60">
                      Tsy misy tononkalo hita.
                    </p>
                    <Link href="/write">
                      <Button variant="primary">Hanorata ny voalohany</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </RevealSection>

        {/* Manifesto Section */}
        <RevealSection>
          <section className="mx-auto max-w-4xl px-4 py-32 text-center">
            <span className="material-symbols-outlined mb-8 text-5xl text-outline-variant/40">format_quote</span>
            <blockquote className="mb-12 font-serif text-3xl font-light italic leading-snug text-primary md:text-5xl">
              &quot;Ampiakaro ny aingam-panahy ka avadiho ho soratra. Ampiasao ny penina ary ampanjakao ny Teny &quot;
            </blockquote>
            <div className="mx-auto h-px w-24 bg-outline-variant/30 mb-8" />
            <p className="font-sans text-[12px] font-bold uppercase tracking-widest text-on-surface-variant/60">Ny Fanambarana</p>
          </section>
        </RevealSection>

        {/* Final CTA */}
        <RevealSection>
          <section className="mx-auto mb-24 max-w-7xl px-4 md:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-primary-container p-12 text-center text-white md:p-24">
              <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-container to-tertiary-container opacity-90" />
              <div className="relative z-10 flex flex-col items-center gap-8">
                <h2 className="font-serif text-4xl font-medium md:text-6xl">Vonona handray ny penina ve ianao?</h2>
                <p className="max-w-xl font-serif text-xl italic text-on-primary-container/80">
                  Miaraha amin&apos;ny fianakaviamben&apos;ny mpanoratra manome lanja ny kanton&apos;ny teny. Maimaim-poana ny fisoratana anarana.
                </p>
                <Link href="/auth/register">
                  <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 border-none px-12 py-6 text-lg">
                    Hanoratra anarana
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </RevealSection>
      </main>

      <Footer />
    </div>
  );
}
