"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PoemCard from "@/components/poems/PoemCard";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { getUserProfile, getPoems, getBookmarkedPoems, followUser, unfollowUser, isFollowing, getFollowerCount, deletePoem } from "@/lib/firebase/firestore";
import { Poem, User } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { useBookmarks } from "@/hooks/useBookmarks";
import Link from "next/link";

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [author, setAuthor] = useState<User | null>(null);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"published" | "drafts" | "bookmarks">("published");
  const [following, setFollowing] = useState(false);
  const [stats, setStats] = useState({ publishedCount: 0, followerCount: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [poemToDelete, setPoemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.uid === id;

  // Batch bookmark checks
  const poemIds = useMemo(() => poems.map(p => p.id), [poems]);
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks(poemIds);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const [userData, publishedPoems, followers] = await Promise.all([
          getUserProfile(id),
          getPoems({ authorId: id, status: "published" }),
          getFollowerCount(id)
        ]);
        
        setAuthor(userData);
        setStats({
          publishedCount: publishedPoems.length,
          followerCount: followers
        });
        
        if (user && !isOwner) {
          const followStatus = await isFollowing(user.uid, id);
          setFollowing(followStatus);
        }

        let currentPoems: Poem[] = [];
        if (activeTab === "bookmarks") {
          currentPoems = await getBookmarkedPoems(id);
        } else if (activeTab === "drafts" && isOwner) {
          currentPoems = await getPoems({ authorId: id, status: "draft" });
        } else {
          currentPoems = publishedPoems;
        }
        setPoems(currentPoems);
      } catch (error) {
        console.error("Nisy fahadisoana teo am-pampidirana ny mombamomba:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id, activeTab, isOwner, user]);

  const handleFollow = async () => {
    if (!user || isOwner) return;
    try {
      if (following) {
        await unfollowUser(user.uid, id);
        setFollowing(false);
        setStats(prev => ({ ...prev, followerCount: prev.followerCount - 1 }));
      } else {
        await followUser(user.uid, id);
        setFollowing(true);
        setStats(prev => ({ ...prev, followerCount: prev.followerCount + 1 }));
      }
    } catch (error) {
      console.error("Nisy fahadisoana teo am-panarahana:", error);
    }
  };

  const handleDeleteRequest = (poemId: string) => {
    setPoemToDelete(poemId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!poemToDelete) return;
    setIsDeleting(true);
    try {
      await deletePoem(poemToDelete);
      setPoems(prev => prev.filter(p => p.id !== poemToDelete));
      setStats(prev => ({ ...prev, publishedCount: Math.max(0, prev.publishedCount - 1) }));
      showToast("Voafafa ny tononkalo", "success");
    } catch (error) {
      console.error("Nisy fahadisoana teo am-pamafana:", error);
      showToast("Tsy afaka namafa ny tononkalo", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setPoemToDelete(null);
    }
  };

  // Structured skeleton loading
  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 md:px-gutter py-8 md:py-margin-page">
          <section className="grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
            <div className="md:col-span-8 flex flex-col gap-6">
              <Skeleton className="h-14 w-72 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-6 w-full max-w-lg rounded mt-4" />
              <Skeleton className="h-6 w-4/5 max-w-lg rounded" />
              <div className="flex gap-4 mt-4">
                <Skeleton className="h-12 w-40 rounded" />
              </div>
            </div>
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <Skeleton className="col-span-2 aspect-square rounded-lg" />
              <Skeleton className="h-24 rounded" />
              <Skeleton className="h-24 rounded" />
            </div>
          </section>
          <Skeleton className="h-px w-full" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-80 rounded" />
            ))}
          </div>
        </main>
      </>
    );
  }

  if (!author) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-surface text-center px-4">
          <span className="material-symbols-outlined text-6xl text-outline-variant/30">person_off</span>
          <p className="font-serif text-xl italic text-on-surface-variant/60">
            Ao amin&apos;ny nofy ihany no misy io mpanoratra io.
          </p>
          <Link href="/discover" className="font-sans text-sm text-primary hover:underline">
            Hiverina any amin&apos;ny fikarohana
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 md:px-gutter py-8 md:py-margin-page">
        {/* Author Header (Bento Style) */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
          {/* Bio & Primary Info */}
          <div className="md:col-span-8 flex flex-col gap-6">
            <div>
              <h1 className="mb-2 font-serif text-4xl md:text-5xl tracking-tight text-primary">{author.displayName}</h1>
              <p className="font-sans text-[12px] font-medium uppercase tracking-widest text-on-surface-variant">
                {author.role || "Mpanoratra"}
              </p>
            </div>
            <div className="reading-container ml-0 font-serif text-xl leading-relaxed text-on-surface-variant/80">
              {author.bio || "Aleon'ity mpanoratra ity ny sanganasany no miteny ho azy."}
            </div>
            <div className="mt-2 flex items-center gap-4">
              {isOwner ? (
                <Link href="/profile/edit">
                  <Button variant="primary" className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Hanova ny mombamomba
                  </Button>
                </Link>
              ) : (
                <>
                  <Button 
                    variant={following ? "secondary" : "primary"}
                    onClick={handleFollow}
                  >
                    {following ? "Manaraka" : "Hanaraka ny mpanoratra"}
                  </Button>
                  {/* Hafatra button — disabled with tooltip */}
                  <Button 
                    variant="secondary"
                    disabled
                    className="opacity-50 cursor-not-allowed relative group"
                  >
                    Hafatra
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-surface-container-highest px-3 py-1 font-sans text-[10px] text-on-surface opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
                      Ho avy tsy ho ela
                    </span>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats & Image Bento */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div className="relative col-span-2 aspect-square overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container">
              {author.photoURL ? (
                <Image 
                  src={author.photoURL} 
                  alt={author.displayName || "Avatar"} 
                  fill 
                  className="object-cover grayscale opacity-90 transition-all hover:scale-105"
                />
              ) : (
                <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-[120px] text-outline/20">
                  account_circle
                </span>
              )}
            </div>
            <div className="flex flex-col items-center justify-center rounded border border-outline-variant/50 bg-surface-container-low p-4 text-center">
              <span className="font-serif text-3xl font-medium text-primary">{stats.publishedCount}</span>
              <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-on-surface-variant mt-1">
                Navoaka
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded border border-outline-variant/50 bg-surface-container-low p-4 text-center">
              <span className="font-serif text-3xl font-medium text-primary">{stats.followerCount}</span>
              <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-on-surface-variant mt-1">
                Mpanaraka
              </span>
            </div>
          </div>
        </section>

        <div className="mt-8 h-px w-full bg-outline-variant/40" />

        {/* Anthology Section */}
        <section className="flex flex-col gap-12">
          <div className="flex flex-col justify-between items-start gap-4 md:flex-row md:items-end">
            <h2 className="font-serif text-4xl tracking-tight text-primary">Ny Sanganasa</h2>
            <div className="flex gap-4 font-sans text-xs font-semibold uppercase tracking-widest border-b border-outline-variant/30 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveTab("published")}
                className={`border-b-2 py-2 transition-colors whitespace-nowrap ${activeTab === "published" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}
              >
                Sanganasa Navoaka
              </button>
              {isOwner && (
                <button 
                  onClick={() => setActiveTab("drafts")}
                  className={`border-b-2 py-2 transition-colors whitespace-nowrap ${activeTab === "drafts" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}
                >
                  Vakiraoka
                </button>
              )}
              <button 
                onClick={() => setActiveTab("bookmarks")}
                className={`border-b-2 py-2 transition-colors whitespace-nowrap ${activeTab === "bookmarks" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}
              >
                Ny Tahiry Tianao
              </button>
            </div>
          </div>

          {/* Poem Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {poems.map((poem) => (
              <PoemCard 
                key={poem.id} 
                id={poem.id}
                title={poem.title}
                author={poem.authorName}
                authorId={poem.authorId}
                excerpt={poem.excerpt}
                moods={poem.moods}
                likesCount={poem.likesCount}
                imageUrl={poem.imageUrl}
                showDeleteButton={isOwner}
                onDelete={handleDeleteRequest}
                isBookmarked={isBookmarked(poem.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>

          {/* Enriched Empty States */}
          {poems.length === 0 && (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              {activeTab === "bookmarks" ? (
                <>
                  <span className="material-symbols-outlined text-6xl text-outline-variant/20">bookmark_border</span>
                  <p className="font-serif text-xl italic text-on-surface-variant/40">
                    Miandry ny sanganasa tianao ity tahiry ity.
                  </p>
                  <Link href="/discover">
                    <Button variant="secondary">Hijery tononkalo</Button>
                  </Link>
                </>
              ) : activeTab === "drafts" ? (
                <>
                  <span className="material-symbols-outlined text-6xl text-outline-variant/20">edit_note</span>
                  <p className="font-serif text-xl italic text-on-surface-variant/40">
                    Tsy misy vakiraoka an-dalam-panoratana.
                  </p>
                  <Link href="/write">
                    <Button variant="primary">Hanomboka vakiraoka vaovao</Button>
                  </Link>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-6xl text-outline-variant/20">ink_pen</span>
                  <p className="font-serif text-xl italic text-on-surface-variant/40">
                    {isOwner 
                      ? "Mbola tsy navoaka tononkalo ianao." 
                      : "Mbola tsy namela soratra teo amin'ny taratasy ity mpanoratra ity."}
                  </p>
                  {isOwner && (
                    <Link href="/write">
                      <Button variant="primary">Hanorata ny voalohany</Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Hamafa ity tononkalo ity?"
        message="Tsy azo averina intsony ity tononkalo ity rehefa voafafa. Ny hafatra rehetra sy ny tiako rehetra dia ho very koa."
        confirmLabel="Hamafa"
        cancelLabel="Hanafoana"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setShowDeleteModal(false); setPoemToDelete(null); }}
        isLoading={isDeleting}
      />
    </>
  );
}
