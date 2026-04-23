"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/firebase/auth";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navLinks = [
    { name: "Hizaha", href: "/" },
    { name: "Tahiry", href: "/archive" },
    { name: "Hanoratra", href: "/write" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/95 backdrop-blur supports-backdrop-filter:bg-surface/60">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        {/* Brand */}
        <Link 
          href="/" 
          className="font-serif text-2xl italic tracking-tight text-primary transition-opacity hover:opacity-80"
        >
          Ranomainty sy Aingam-panahy
        </Link>

        {/* Navigation */}
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
        <div className="flex items-center gap-6">
          <button className="text-primary transition-opacity hover:opacity-70">
            <span className="material-symbols-outlined">search</span>
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href={`/profile/${user.uid}`} className="relative h-10 w-10 overflow-hidden rounded-full border border-outline-variant hover:border-primary transition-colors">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.displayName || "Mombamomba"} fill className="object-cover grayscale" />
                ) : (
                  <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-outline">
                    account_circle
                  </span>
                )}
              </Link>
              <button 
                onClick={() => signOut()}
                className="font-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
              >
                Hivoaka
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="font-sans text-sm font-semibold uppercase tracking-widest text-primary transition-opacity hover:opacity-70"
            >
              Hiditra
            </Link>
          )}

          <Link
            href="/write"
            className="rounded bg-primary px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-on-primary transition-colors hover:bg-primary/90"
          >
            Hanoratra
          </Link>
        </div>
      </div>
    </header>
  );
}
