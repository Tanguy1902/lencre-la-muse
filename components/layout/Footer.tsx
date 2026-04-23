import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-outline-variant bg-surface py-12">
      <div className="mx-auto flex flex-col items-center gap-8 px-8 text-center">
        {/* Brand */}
        <div className="font-serif text-xl italic text-primary">
          Ranomainty sy Aingam-panahy
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 font-serif text-sm uppercase tracking-wide">
          <Link href="/manifesto" className="text-on-surface-variant/60 transition-colors hover:text-primary">
            Fanambarana
          </Link>
          <Link href="/privacy" className="text-on-surface-variant/60 transition-colors hover:text-primary">
            Tsiambaratelo
          </Link>
          <Link href="/terms" className="text-on-surface-variant/60 transition-colors hover:text-primary">
            Fepetra
          </Link>
          <Link href="/contact" className="text-on-surface-variant/60 transition-colors hover:text-primary">
            Mifandray
          </Link>
        </nav>

        {/* Copyright */}
        <div className="font-serif text-sm uppercase tracking-wide text-on-surface-variant/60">
          © {new Date().getFullYear()} Ranomainty sy Aingam-panahy. Zo rehetra voatokana.
        </div>
        <div className="font-serif text-sm italic text-on-surface-variant/40">
          Ny manoratra dia ny miaina.
        </div>
      </div>
    </footer>
  );
}
