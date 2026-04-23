"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/firebase/auth";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Hizaha", href: "/discover" },
    { name: "Tahiry", href: "/archive" },
    { name: "Hanoratra", href: "/write" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/95 backdrop-blur supports-backdrop-filter:bg-surface/60">
      <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Brand */}
        <Link 
          href="/" 
          className="font-serif text-xl md:text-2xl italic tracking-tight text-primary transition-opacity hover:opacity-80 truncate pr-4"
        >
          Ranomainty sy Aingam-panahy
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-serif text-lg italic transition-all hover:text-primary ${
                  isActive
                    ? "border-b-2 border-primary text-primary"
                    : "text-on-surface-variant/70"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-6">
          <button className="hidden sm:block text-primary transition-opacity hover:opacity-70">
            <span className="material-symbols-outlined">search</span>
          </button>
          
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link href={`/profile/${user.uid}`} className="relative h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-full border border-outline-variant hover:border-primary transition-colors">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.displayName || "Mombamomba"} fill className="object-cover grayscale" />
                ) : (
                  <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-outline text-[20px] md:text-[24px]">
                    account_circle
                  </span>
                )}
              </Link>
              <button 
                onClick={() => signOut()}
                className="hidden md:block font-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
              >
                Hivoaka
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden sm:block font-sans text-sm font-semibold uppercase tracking-widest text-primary transition-opacity hover:opacity-70"
            >
              Hiditra
            </Link>
          )}

          <Link
            href="/write"
            className="hidden lg:block rounded bg-primary px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-on-primary transition-colors hover:bg-primary/90"
          >
            Hanoratra
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="flex h-10 w-10 items-center justify-center text-primary md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 h-[calc(100vh-64px)] bg-surface p-6 md:hidden">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-serif text-2xl italic ${
                    isActive ? "text-primary" : "text-on-surface-variant/70"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="mt-4 h-px w-full bg-outline-variant/30" />
            <div className="flex flex-col gap-4 pt-4">
              {user ? (
                <button 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-on-surface-variant"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Hivoaka
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-primary"
                >
                  <span className="material-symbols-outlined">login</span>
                  Hiditra
                </Link>
              )}
              <Link
                href="/write"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center rounded bg-primary py-4 font-sans text-sm font-bold uppercase tracking-widest text-on-primary"
              >
                Hanoratra tononkalo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
