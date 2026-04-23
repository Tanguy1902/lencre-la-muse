"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import TipTapEditor from "@/components/editor/TipTapEditor";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import { createPoem, getPoem, updatePoem } from "@/lib/firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { analyzeMood } from "@/lib/utils/moodAnalyzer";

export default function EditorPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center font-serif text-xl italic text-on-surface-variant/60">
          Mampiditra ny mpanoratra...
        </div>
      </>
    }>
      <EditorContent />
    </Suspense>
  );
}

function EditorContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [moods, setMoods] = useState<string[]>([]);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [initialContent, setInitialContent] = useState("");

  // Charger le poème en mode édition
  useEffect(() => {
    if (!editId || !user) return;
    
    const loadPoem = async () => {
      setLoadingEdit(true);
      try {
        const poem = await getPoem(editId);
        if (poem && poem.authorId === user.uid) {
          setTitle(poem.title);
          setContent(poem.content);
          setInitialContent(poem.content);
          setImageUrl(poem.imageUrl || "");
          setMoods(poem.moods || []);
          const text = poem.content.replace(/<[^>]*>/g, " ").trim();
          setWordCount(text ? text.split(/\s+/).length : 0);
        } else {
          showToast("Tsy azonao ovaina ity tononkalo ity", "error");
          router.push("/");
        }
      } catch (error) {
        console.error("Nisy fahadisoana teo am-pampidirana ny tononkalo:", error);
        showToast("Tsy afaka nampiditra ny tononkalo", "error");
      } finally {
        setLoadingEdit(false);
      }
    };
    loadPoem();
  }, [editId, user, router, showToast]);

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
      showToast("Mba omeo lohateny sy votoatiny ny tononkalonao.", "error");
      return;
    }

    setIsPublishing(true);
    try {
      const excerpt = content.replace(/<[^>]*>/g, " ").substring(0, 150) + "...";
      
      if (isEditMode && editId) {
        await updatePoem(editId, {
          title,
          content,
          excerpt,
          imageUrl,
          moods: moods.length > 0 ? moods : ["Alahelo"],
          status: "published",
          visibility: "public",
        });
        showToast("Voaova ny tononkalo", "success");
        router.push(`/poem/${editId}`);
      } else {
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
        showToast("Voavoaka ny tononkalo!", "success");
        router.push(`/poem/${poemId}`);
      }
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pamoahana azy:", error);
      showToast("Nisy fahadisoana teo am-pamoahana azy.", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user || isPublishing) return;
    setIsPublishing(true);
    try {
      const excerpt = content.replace(/<[^>]*>/g, " ").substring(0, 150) + "...";
      
      if (isEditMode && editId) {
        await updatePoem(editId, {
          title,
          content,
          excerpt,
          imageUrl,
          moods: moods.length > 0 ? moods : ["Alahelo"],
          status: "draft",
          visibility: "private",
        });
        showToast("Voatahiry ny vakiraoka", "success");
      } else {
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
        showToast("Voatahiry ny vakiraoka", "success");
      }
      router.push(`/profile/${user.uid}`);
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pitahirizana ny vakiraoka:", error);
      showToast("Nisy fahadisoana teo am-pitahirizana", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  if (loadingEdit) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center font-serif text-xl italic text-on-surface-variant/60">
          Mampiditra ny tononkalo...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="relative flex flex-col items-center px-4 pb-48 pt-16 md:pt-24 lg:px-0">
        {/* Mobile Action Bar (Top) */}
        <div className="fixed top-16 z-40 flex w-full items-center justify-between border-b border-outline-variant bg-surface/80 px-4 py-2 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary"></span>
            <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">
              {isEditMode ? "Fanovana" : "Vakiraoka"}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSaveDraft}
              disabled={isPublishing}
              className="rounded-full bg-surface-container px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-primary"
            >
              Tahiry
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="rounded-full bg-primary px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-on-primary"
            >
              {isPublishing ? "..." : isEditMode ? "Hanova" : "Avoahy"}
            </button>
          </div>
        </div>

        {/* Actions à gauche (Desktop) */}
        <aside className="fixed left-12 top-1/3 z-40 hidden flex-col gap-6 lg:flex">
          <div className="flex flex-col gap-2">
            <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-outline">Sata</p>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="h-2 w-2 rounded-full bg-secondary"></span>
              <span className="font-sans text-sm">
                {isEditMode ? "Fanovana" : "Voatahiry ny vakiraoka"}
              </span>
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

        {/* Actions à droite (Desktop) */}
        <aside className="fixed right-12 top-1/3 z-40 hidden flex-col gap-4 lg:flex">
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            {isPublishing ? "Mampiditra..." : isEditMode ? "Hanova" : "Haparitaka"}
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
          {isEditMode && (
            <Button 
              variant="secondary" 
              className="flex items-center gap-2"
              onClick={() => router.push(`/poem/${editId}`)}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              Hanafoana
            </Button>
          )}
        </aside>

        {/* Zone de l'éditeur */}
        <div className="w-full max-w-reading-column mt-12 lg:mt-0">
          {isEditMode && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-outline-variant/50 bg-surface-container-low px-4 py-3">
              <span className="material-symbols-outlined text-[20px] text-primary">edit</span>
              <span className="font-sans text-sm text-on-surface-variant">
                Fanovana ny tononkalo efa misy
              </span>
            </div>
          )}
          <div className="mb-8 md:mb-12">
            <div className="mb-6 md:mb-8">
              <ImageUpload value={imageUrl} onUpload={setImageUrl} />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lohateny..."
              className="w-full bg-transparent p-0 font-serif text-3xl md:text-5xl font-medium text-primary outline-none placeholder:text-outline-variant/30"
            />
            <div className="mt-4 md:mt-6 h-px w-12 md:w-16 bg-outline-variant" />
          </div>

          <TipTapEditor 
            content={isEditMode ? initialContent : content} 
            onChange={handleContentChange} 
          />
        </div>

        {/* Barre d'inspiration en bas */}
        <div className="glass-panel fixed bottom-6 md:bottom-8 z-50 flex max-w-[90vw] items-center gap-4 md:gap-6 rounded-full border border-outline-variant px-4 md:px-6 py-2 md:py-3 shadow-lg">
          <div className="flex items-center gap-2 md:gap-3 border-r border-outline-variant pr-4 md:pr-6 overflow-hidden">
            <span className="hidden md:block font-sans text-[10px] font-medium uppercase tracking-widest text-outline shrink-0">Fihetseham-po</span>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {moods.length > 0 ? (
                moods.map(mood => (
                  <span key={mood} className="shrink-0 rounded-full border border-primary bg-primary/10 px-2 md:px-3 py-1 font-sans text-[9px] md:text-[10px] text-primary">
                    {mood}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-outline-variant px-3 py-1 font-sans text-[9px] md:text-[10px] text-on-surface-variant/40 italic whitespace-nowrap">
                  Mihaino...
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2 font-sans text-[12px] md:text-sm text-on-surface-variant shrink-0">
            <span className="material-symbols-outlined text-[16px] md:text-[18px]">notes</span>
            {wordCount}
          </div>
        </div>
      </main>
    </>
  );
}
