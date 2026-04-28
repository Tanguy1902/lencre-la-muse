"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import { getUserProfile, updateUserProfile } from "@/lib/firebase/firestore";
import { useToast } from "@/components/ui/Toast";
import { validateProfile, LIMITS } from "@/lib/utils/validation";
import { User } from "@/types";

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState<Partial<User>>({
    displayName: "",
    role: "",
    bio: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      if (user) {
        try {
          const data = await getUserProfile(user.uid);
          if (data) {
            setProfile({
              displayName: data.displayName || "",
              role: data.role || "",
              bio: data.bio || "",
              photoURL: data.photoURL || "",
            });
          }
        } catch (error) {
          console.error("Fahadisoana teo am-pampidirana ny mombamomba:", error);
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, router]);

  const handleSave = async () => {
    if (!user) return;

    // Validation
    const errors = validateProfile({
      displayName: profile.displayName,
      bio: profile.bio,
      role: profile.role,
    });
    if (errors.length > 0) {
      showToast(errors[0].message, "error");
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, profile);
      showToast("Voatahiry ny fiovana", "success");
      router.push(`/profile/${user.uid}`);
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pitehirizana ny mombamomba:", error);
      showToast("Nisy fahadisoana teo am-pitahirizana", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 md:px-8 py-16">
          <Skeleton className="h-10 w-64 rounded mb-4" />
          <Skeleton className="h-6 w-96 rounded mb-12" />
          <div className="flex flex-col gap-10 rounded-xl border border-outline-variant bg-surface-container-lowest p-8 md:p-12">
            <Skeleton className="h-40 w-40 rounded-lg mx-auto" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-32 w-full rounded" />
            <Skeleton className="h-12 w-48 rounded" />
          </div>
        </main>
      </>
    );
  }

  const nameLen = (profile.displayName || "").length;
  const bioLen = (profile.bio || "").length;
  const nameCharClass = nameLen > LIMITS.DISPLAY_NAME_MAX ? "char-count-error" : nameLen > LIMITS.DISPLAY_NAME_MAX * 0.9 ? "char-count-warn" : "char-count-ok";
  const bioCharClass = bioLen > LIMITS.BIO_MAX ? "char-count-error" : bioLen > LIMITS.BIO_MAX * 0.9 ? "char-count-warn" : "char-count-ok";

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 md:px-8 py-8 md:py-16">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1 font-sans text-sm text-on-surface-variant hover:text-primary transition-colors mb-4 w-fit"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Hiverina
          </button>
          <h1 className="font-serif text-4xl tracking-tight text-primary">Hanova ny mombamomba</h1>
          <p className="font-serif text-lg italic text-on-surface-variant/70">
            Amboary ny fomba fijerin&apos;izao tontolo izao anao.
          </p>
        </div>

        <div className="flex flex-col gap-10 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 md:p-12">
          {/* Photo de profil */}
          <div className="flex flex-col gap-4">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-primary">
              Sarin&apos;ny mpanoratra
            </label>
            <div className="w-40">
              <ImageUpload 
                value={profile.photoURL} 
                onUpload={(url) => setProfile({ ...profile, photoURL: url })} 
              />
            </div>
          </div>

          {/* Nom d'affichage */}
          <div className="flex flex-col gap-4">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-primary">
              Anarana na solon&apos;anarana
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                maxLength={LIMITS.DISPLAY_NAME_MAX + 5}
                className="w-full border-b border-outline-variant bg-transparent py-3 font-serif text-2xl outline-none focus:border-primary transition-colors placeholder:text-outline-variant/30"
                placeholder="Ny solon'anaranao..."
              />
              {nameLen > LIMITS.DISPLAY_NAME_MAX * 0.7 && (
                <span className={`absolute right-0 bottom-1 font-sans text-[10px] ${nameCharClass}`}>
                  {nameLen}/{LIMITS.DISPLAY_NAME_MAX}
                </span>
              )}
            </div>
          </div>

          {/* Rôle / Titre */}
          <div className="flex flex-col gap-4">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-primary">
              Andraikitra
            </label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              maxLength={LIMITS.ROLE_MAX}
              className="w-full border-b border-outline-variant bg-transparent py-3 font-serif text-xl italic outline-none focus:border-primary transition-colors placeholder:text-outline-variant/30"
              placeholder="Mpanoratra, mpanonofy, mpanara-maso ny fiainana..."
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-4">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-primary">
              Mombamomba (Ny tantaran&apos;ny fonao)
            </label>
            <div className="relative">
              <textarea
                rows={5}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                maxLength={LIMITS.BIO_MAX + 10}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-6 font-serif text-lg leading-relaxed outline-none focus:border-primary transition-colors placeholder:text-outline-variant/30"
                placeholder="Teny fohy momba ny dianao amin'ny tontolon'ny tononkalo..."
              />
              <span className={`absolute right-3 bottom-3 font-sans text-[10px] ${bioCharClass}`}>
                {bioLen}/{LIMITS.BIO_MAX}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 pt-6 border-t border-outline-variant/30">
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-10"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Mitahiry...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Hitehirizana ny mombamomba
                </>
              )}
            </Button>
            <button 
              onClick={() => router.back()}
              className="font-sans text-sm font-semibold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              Hanafoana
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
