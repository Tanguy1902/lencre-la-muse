"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { addComment, getComments } from "@/lib/firebase/firestore";
import { Comment } from "@/types";
import Button from "@/components/ui/Button";

interface CommentSectionProps {
  poemId: string;
}

export default function CommentSection({ poemId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(poemId);
        setComments(data);
      } catch (error) {
        console.error("Nisy fahadisoana teo am-pampidirana ny hafatra:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [poemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const commentData = {
        poemId,
        authorId: user.uid,
        authorName: user.displayName || "Tsy fantatra anarana",
        authorImage: user.photoURL || "",
        content: newComment.trim(),
      };
      await addComment(poemId, commentData);
      
      // Update local state
      const freshComments = await getComments(poemId);
      setComments(freshComments);
      setNewComment("");
    } catch (error) {
      console.error("Nisy fahadisoana teo am-panampiana hafatra:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-20 flex flex-col gap-10">
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        <h3 className="font-serif text-2xl text-primary">Bitsika & Akon&apos;ny fo</h3>
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          {comments.length} Hafatra
        </span>
      </div>

      {/* Formulaire */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-outline-variant/30 bg-surface-container">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.displayName || ""} fill className="object-cover grayscale" />
              ) : (
                <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-on-surface-variant/40">
                  account_circle
                </span>
              )}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Zarao ny tsapanao..."
              className="min-h-[100px] w-full bg-transparent font-serif text-lg italic outline-none placeholder:text-on-surface-variant/30"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="primary" disabled={!newComment.trim() || isSubmitting}>
              {isSubmitting ? "Mandefa..." : "Haneho hevitra"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="rounded-lg border border-dashed border-outline-variant/50 p-8 text-center">
          <p className="font-serif italic text-on-surface-variant/60">
            Midira mba hizaranao ny tsapanao.
          </p>
        </div>
      )}

      {/* Liste des commentaires */}
      <div className="flex flex-col gap-8">
        {loading ? (
          <div className="py-10 text-center font-serif italic text-on-surface-variant/40">Mampiditra ny bitsika...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-outline-variant/30 bg-surface-container">
                {comment.authorImage ? (
                  <Image src={comment.authorImage} alt={comment.authorName} fill className="object-cover grayscale" />
                ) : (
                  <span className="material-symbols-outlined flex h-full w-full items-center justify-center text-on-surface-variant/40">
                    account_circle
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-sans text-sm font-bold text-primary">{comment.authorName}</span>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/50">
                    {comment.createdAt && 
                      (() => {
                        const date = comment.createdAt as unknown;
                        if (typeof date === 'object' && date !== null && 'seconds' in date) {
                          return new Date((date as { seconds: number }).seconds * 1000).toLocaleDateString("mg-MG");
                        }
                        return new Date(date as string).toLocaleDateString("mg-MG");
                      })()
                    }
                  </span>
                </div>
                <p className="font-serif text-lg leading-relaxed text-on-surface-variant/80">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center font-serif italic text-on-surface-variant/30">
            Mbola manjaka ny fahanginana eto...
          </div>
        )}
      </div>
    </section>
  );
}
