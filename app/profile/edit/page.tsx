"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import { useAuth } from "@/components/providers/AuthProvider";
import { getUserProfile, createUserProfile } from "@/lib/firebase/firestore";
import { User } from "@/types";

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
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
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfile({
            displayName: data.displayName || "",
            role: data.role || "",
            bio: data.bio || "",
            photoURL: data.photoURL || "",
          });
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, router]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await createUserProfile(user.uid, profile);
      router.push(`/profile/${user.uid}`);
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pitehirizana ny mombamomba:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface font-serif text-xl italic text-on-surface-variant/60">
        Mampiditra ny taratasy...
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-8 py-16">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-4xl tracking-tight text-primary">Hanova ny mombamomba</h1>
          <p className="font-serif text-lg italic text-on-surface-variant/70">
            Amboary ny fomba fijerin&apos;izao tontolo izao anao.
          </p>
        </div>

        <div className="flex flex-col gap-10 rounded-xl border border-outline-variant bg-surface-container-lowest p-8 md:p-12">
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
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
              className="w-full border-b border-outline-variant bg-transparent py-3 font-serif text-2xl outline-none focus:border-primary transition-colors placeholder:text-outline-variant/30"
              placeholder="Ny solon&apos;anaranao..."
            />
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
              className="w-full border-b border-outline-variant bg-transparent py-3 font-serif text-xl italic outline-none focus:border-primary transition-colors placeholder:text-outline-variant/30"
              placeholder="Mpanoratra, mpanonofy, mpanara-maso ny fiainana..."
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-4">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-primary">
              Mombamomba (Ny tantaran&apos;ny fonao)
            </label>
            <textarea
              rows={5}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-6 font-serif text-lg leading-relaxed outline-none focus:border-primary transition-colors placeholder:text-outline-variant/30"
              placeholder="Teny fohy momba ny dianao amin&apos;ny tontolon&apos;ny tononkalo..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 pt-6">
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={isSaving}
              className="px-10"
            >
              {isSaving ? "Eo am-pitehirizana..." : "Hitehirizana ny mombamomba"}
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
