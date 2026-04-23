"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import TipTapEditor from "@/components/editor/TipTapEditor";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import { createPoem } from "@/lib/firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";
import { analyzeMood } from "@/lib/utils/moodAnalyzer";

export default function EditorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("Lohatenynao eto...");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [moods, setMoods] = useState<string[]>([]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    const text = newContent.replace(/<[^>]*>/g, " ").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
    
    // Suggérer des humeurs
    const suggested = analyzeMood(text);
    setMoods(suggested);
  };

  const handlePublish = async () => {
    if (!user || isPublishing) return;
    
    if (!title || !content) {
      alert("Mba omeo lohateny sy votoatiny ny tononkalonao.");
      return;
    }

    setIsPublishing(true);
    try {
      const excerpt = content.replace(/<[^>]*>/g, " ").substring(0, 150) + "...";
      const poemId = await createPoem({
        title,
        content,
        excerpt,
        imageUrl,
        authorId: user.uid,
        authorName: user.displayName || "Mpanoratra tsy fantatra",
        authorImage: user.photoURL || "",
        moods: moods.length > 0 ? moods : ["Alahelo"],
        status: "published",
        visibility: "public",
      });
      router.push(`/poem/${poemId}`);
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pamoahana azy:", error);
      alert("Nisy fahadisoana teo am-pamoahana azy.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user || isPublishing) return;
    setIsPublishing(true);
    try {
      const excerpt = content.replace(/<[^>]*>/g, " ").substring(0, 150) + "...";
      await createPoem({
        title,
        content,
        excerpt,
        imageUrl,
        authorId: user.uid,
        authorName: user.displayName || "Mpanoratra tsy fantatra",
        authorImage: user.photoURL || "",
        moods: moods.length > 0 ? moods : ["Alahelo"],
        status: "draft",
        visibility: "private",
      });
      router.push(`/profile/${user.uid}`);
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pitahirizana ny vakiraoka:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    // Stocker temporairement dans le localStorage pour l'aperçu si nécessaire
    // Ou simplement ouvrir un modal. Pour l'instant, on simule.
    alert("Ho hita tsy ho ela ny fijerena mialoha!");
  };

  return (
    <>
      <Header />
      <main className="relative flex flex-col items-center px-6 pb-48 pt-24 lg:px-0">
        {/* Actions à gauche */}
        <aside className="fixed left-12 top-1/3 z-40 hidden flex-col gap-6 lg:flex">
          <div className="flex flex-col gap-2">
            <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-outline">Sata</p>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="h-2 w-2 rounded-full bg-secondary"></span>
              <span className="font-sans text-sm">Voatahiry ny vakiraoka</span>
            </div>
            <span className="mt-1 font-sans text-[11px] text-outline-variant">Vao teo</span>
          </div>
          
          <div className="mt-8 flex flex-col gap-3">
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm text-on-surface transition-colors hover:bg-surface-container hover:text-primary">
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Fikirakirana
            </button>
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm text-on-surface transition-colors hover:bg-surface-container hover:text-primary">
              <span className="material-symbols-outlined text-[18px]">history</span>
              Tantara
            </button>
          </div>
        </aside>

        {/* Actions à droite */}
        <aside className="fixed right-12 top-1/3 z-40 hidden flex-col gap-4 lg:flex">
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            {isPublishing ? "Mampiditra..." : "Haparitaka"}
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center gap-2"
            onClick={handleSaveDraft}
            disabled={isPublishing}
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            Vakiraoka
          </Button>
          <Button 
            variant="secondary" 
            className="flex items-center gap-2"
            onClick={handlePreview}
          >
            Hijery
          </Button>
        </aside>

        {/* Zone de l'éditeur */}
        <div className="w-full max-w-reading-column">
          <div className="mb-12">
            <div className="mb-8">
              <ImageUpload value={imageUrl} onUpload={setImageUrl} />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lohateny..."
              className="w-full bg-transparent p-0 font-serif text-5xl font-medium text-primary outline-none placeholder:text-outline-variant/30"
            />
            <div className="mt-6 h-px w-16 bg-outline-variant" />
          </div>

          <TipTapEditor content={content} onChange={handleContentChange} />
        </div>

        {/* Barre d'inspiration en bas */}
        <div className="glass-panel fixed bottom-8 z-50 flex items-center gap-6 rounded-full border border-outline-variant px-6 py-3 shadow-lg">
          <div className="flex items-center gap-3 border-r border-outline-variant pr-6">
            <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-outline">Fihetseham-po soso-kevitra</span>
            <div className="flex gap-2">
              {moods.length > 0 ? (
                moods.map(mood => (
                  <span key={mood} className="rounded-full border border-primary bg-primary/10 px-3 py-1 font-sans text-[10px] text-primary transition-colors">
                    {mood}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-outline-variant px-3 py-1 font-sans text-[10px] text-on-surface-variant/40 italic">
                  Mihaino ny teny...
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 font-sans text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">notes</span>
            {wordCount} teny
          </div>
        </div>
      </main>
    </>
  );
}
