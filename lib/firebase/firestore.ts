import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  serverTimestamp,
  increment,
  setDoc,
  deleteDoc,
  writeBatch,
  runTransaction,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";
import { Poem, User, Comment } from "@/types";

// --- Users ---

export const createUserProfile = async (uid: string, data: Partial<User>) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { uid: userSnap.id, ...userSnap.data() } as unknown as User;
  }
  return null;
};

// --- Poems ---

export const createPoem = async (poemData: Partial<Poem>) => {
  const poemRef = collection(db, "poems");
  const docRef = await addDoc(poemRef, {
    ...poemData,
    likesCount: 0,
    commentsCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updatePoem = async (poemId: string, data: Partial<Poem>) => {
  const poemRef = doc(db, "poems", poemId);
  await updateDoc(poemRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deletePoem = async (poemId: string) => {
  const batch = writeBatch(db);

  // Supprimer les sous-collections likes
  const likesSnap = await getDocs(collection(db, "poems", poemId, "likes"));
  likesSnap.docs.forEach((d) => batch.delete(d.ref));

  // Supprimer les sous-collections comments
  const commentsSnap = await getDocs(collection(db, "poems", poemId, "comments"));
  commentsSnap.docs.forEach((d) => batch.delete(d.ref));

  // Supprimer le poème lui-même
  batch.delete(doc(db, "poems", poemId));

  await batch.commit();
};

export const getPoem = async (poemId: string) => {
  const poemRef = doc(db, "poems", poemId);
  const poemSnap = await getDoc(poemRef);
  if (poemSnap.exists()) {
    return { id: poemSnap.id, ...poemSnap.data() } as unknown as Poem;
  }
  return null;
};

// --- Paginated Poems ---

export interface PoemQueryResult {
  poems: Poem[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const getPoems = async (filter?: { 
  mood?: string; 
  authorId?: string; 
  status?: "published" | "draft"; 
  limit?: number; 
  search?: string;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}): Promise<Poem[]> => {
  const result = await getPoemsPaginated(filter);
  return result.poems;
};

export const getPoemsPaginated = async (filter?: { 
  mood?: string; 
  authorId?: string; 
  status?: "published" | "draft"; 
  limit?: number; 
  search?: string;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}): Promise<PoemQueryResult> => {
  const status = filter?.status || "published";
  const pageSize = filter?.limit || 10;
  
  let q = query(collection(db, "poems"), where("status", "==", status), orderBy("createdAt", "desc"));
  
  if (filter?.mood) {
    q = query(q, where("moods", "array-contains", filter.mood));
  }
  
  if (filter?.authorId) {
    q = query(q, where("authorId", "==", filter.authorId));
  }

  if (filter?.lastDoc) {
    q = query(q, startAfter(filter.lastDoc));
  }
  
  // Fetch one extra to know if there are more
  q = query(q, firestoreLimit(pageSize + 1));
  
  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  const hasMore = docs.length > pageSize;
  const trimmedDocs = hasMore ? docs.slice(0, pageSize) : docs;
  
  let poems = trimmedDocs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Poem));

  if (filter?.search) {
    const searchLower = filter.search.toLowerCase();
    poems = poems.filter(p => 
      p.title.toLowerCase().includes(searchLower) || 
      p.authorName.toLowerCase().includes(searchLower)
    );
  }

  return {
    poems,
    lastDoc: trimmedDocs.length > 0 ? trimmedDocs[trimmedDocs.length - 1] : null,
    hasMore,
  };
};

// --- Poem of the Day ---

export const getPoemOfDay = async (): Promise<Poem | null> => {
  // First try: explicitly flagged poem
  const flaggedQuery = query(
    collection(db, "poems"),
    where("status", "==", "published"),
    where("isPoemOfDay", "==", true),
    firestoreLimit(1)
  );
  const flaggedSnap = await getDocs(flaggedQuery);
  if (!flaggedSnap.empty) {
    const doc = flaggedSnap.docs[0];
    return { id: doc.id, ...doc.data() } as unknown as Poem;
  }

  // Fallback: deterministic pick based on date hash
  const allPublished = query(
    collection(db, "poems"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
    firestoreLimit(20)
  );
  const allSnap = await getDocs(allPublished);
  if (allSnap.empty) return null;

  const poems = allSnap.docs;
  const today = new Date();
  const dayHash = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = dayHash % poems.length;
  const chosen = poems[index];
  return { id: chosen.id, ...chosen.data() } as unknown as Poem;
};

// --- Like (Atomic Transaction) ---

export const toggleLike = async (poemId: string, userId: string): Promise<boolean> => {
  return runTransaction(db, async (transaction) => {
    const likeRef = doc(db, "poems", poemId, "likes", userId);
    const poemRef = doc(db, "poems", poemId);
    const likeSnap = await transaction.get(likeRef);
    
    if (likeSnap.exists()) {
      // Unlike
      transaction.delete(likeRef);
      transaction.update(poemRef, { 
        likesCount: increment(-1),
        updatedAt: serverTimestamp(),
      });
      return false;
    } else {
      // Like
      transaction.set(likeRef, {
        userId,
        createdAt: serverTimestamp(),
      });
      transaction.update(poemRef, { 
        likesCount: increment(1),
        updatedAt: serverTimestamp(),
      });
      return true;
    }
  });
};

export const isLiked = async (userId: string, poemId: string): Promise<boolean> => {
  const likeRef = doc(db, "poems", poemId, "likes", userId);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
};

// --- Comments ---

export const addComment = async (poemId: string, commentData: Partial<Comment>) => {
  return runTransaction(db, async (transaction) => {
    const commentRef = doc(collection(db, "poems", poemId, "comments"));
    const poemRef = doc(db, "poems", poemId);
    
    transaction.set(commentRef, {
      ...commentData,
      createdAt: serverTimestamp(),
    });
    
    transaction.update(poemRef, {
      commentsCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    
    return commentRef.id;
  });
};

export const getComments = async (poemId: string) => {
  const q = query(
    collection(db, "poems", poemId, "comments"), 
    orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Comment));
};

// --- Bookmarks (Recueil) — Atomic ---

export const toggleBookmark = async (userId: string, poemId: string) => {
  return runTransaction(db, async (transaction) => {
    const bookmarkRef = doc(db, "users", userId, "bookmarks", poemId);
    const bookmarkSnap = await transaction.get(bookmarkRef);
    
    if (bookmarkSnap.exists()) {
      transaction.delete(bookmarkRef);
      return false; // Retiré
    } else {
      transaction.set(bookmarkRef, {
        poemId,
        createdAt: serverTimestamp(),
      });
      return true; // Ajouté
    }
  });
};

export const isBookmarked = async (userId: string, poemId: string) => {
  const bookmarkRef = doc(db, "users", userId, "bookmarks", poemId);
  const bookmarkSnap = await getDoc(bookmarkRef);
  return bookmarkSnap.exists();
};

// --- Batch Bookmark Check ---

export const getBookmarkStatuses = async (userId: string, poemIds: string[]): Promise<Record<string, boolean>> => {
  if (poemIds.length === 0) return {};
  const statuses: Record<string, boolean> = {};
  
  await Promise.all(
    poemIds.map(async (poemId) => {
      const bookmarkRef = doc(db, "users", userId, "bookmarks", poemId);
      const bookmarkSnap = await getDoc(bookmarkRef);
      statuses[poemId] = bookmarkSnap.exists();
    })
  );
  
  return statuses;
};

export const getBookmarkedPoems = async (userId: string) => {
  const q = query(collection(db, "users", userId, "bookmarks"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const poemIds = querySnapshot.docs.map(doc => doc.id);
  
  if (poemIds.length === 0) return [];
  
  // On récupère les poèmes un par un en gérant les erreurs de permission (ex: poème devenu privé/draft)
  const poems = await Promise.all(poemIds.map(async (id) => {
    try {
      return await getPoem(id);
    } catch (e) {
      console.warn(`Permission refusée ou poème inexistant: ${id}`);
      return null;
    }
  }));
  return poems.filter(p => p !== null) as Poem[];
};

// --- Follow System (Atomic) ---

export const followUser = async (followerId: string, followedId: string) => {
  const batch = writeBatch(db);
  
  const followRef = doc(db, "users", followedId, "followers", followerId);
  const followingRef = doc(db, "users", followerId, "following", followedId);
  
  batch.set(followRef, { createdAt: serverTimestamp() });
  batch.set(followingRef, { createdAt: serverTimestamp() });
  
  await batch.commit();
};

export const unfollowUser = async (followerId: string, followedId: string) => {
  const batch = writeBatch(db);
  
  const followRef = doc(db, "users", followedId, "followers", followerId);
  const followingRef = doc(db, "users", followerId, "following", followedId);
  
  batch.delete(followRef);
  batch.delete(followingRef);
  
  await batch.commit();
};

export const isFollowing = async (followerId: string, followedId: string) => {
  const followingRef = doc(db, "users", followerId, "following", followedId);
  const followingSnap = await getDoc(followingRef);
  return followingSnap.exists();
};

export const getFollowerCount = async (userId: string) => {
  const q = query(collection(db, "users", userId, "followers"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};
