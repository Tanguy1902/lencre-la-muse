"use client";

import { signInWithGoogle } from "@/lib/firebase/auth";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      console.error("Tsy nahomby ny fidirana", error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-10 shadow-lg text-center">
        <Link href="/" className="mb-12 inline-block font-serif text-3xl italic text-primary">
          Ranomainty sy Aingam-panahy
        </Link>
        
        <h1 className="mb-4 font-serif text-2xl font-medium text-primary">Hiditra ao amin&apos;ny toerana masina</h1>
        <p className="mb-10 font-sans text-sm text-on-surface-variant">
          Manokatra kaonty mba hanombohana ny dianao amin&apos;ny tontolon&apos;ny tononkalo.
        </p>

        <div className="space-y-4">
          <Button 
            variant="secondary" 
            className="w-full flex items-center justify-center gap-3 border-outline-variant py-4"
            onClick={handleGoogleSignIn}
          >
            {/* Google Icon SVG */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">...</svg>
            Hanohy amin&apos;ny alalan&apos;ny Google
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-container-lowest px-2 text-on-surface-variant">Na hisoratra anarana amin&apos;ny imailaka</span>
            </div>
          </div>

          <form className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Solon&apos;anarana</label>
              <input 
                type="text" 
                className="w-full rounded border border-outline-variant bg-surface-container-low px-4 py-3 font-sans text-sm outline-none focus:border-primary transition-colors"
                placeholder="Mpanoratra mangina"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Imailaka</label>
              <input 
                type="email" 
                className="w-full rounded border border-outline-variant bg-surface-container-low px-4 py-3 font-sans text-sm outline-none focus:border-primary transition-colors"
                placeholder="mpanoratra@muse.mg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">Teny miafina</label>
              <input 
                type="password" 
                className="w-full rounded border border-outline-variant bg-surface-container-low px-4 py-3 font-sans text-sm outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
            <Button variant="primary" className="w-full py-4 mt-2">Hanokatra kaonty</Button>
          </form>

          <p className="mt-8 font-sans text-xs text-on-surface-variant">
            Efa manana kaonty ve ianao ?{" "}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">
              Hiditra
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
