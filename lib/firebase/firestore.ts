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
  limit, 
  serverTimestamp,
  increment,
  setDoc,
  deleteDoc
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

export const getPoem = async (poemId: string) => {
  const poemRef = doc(db, "poems", poemId);
  const poemSnap = await getDoc(poemRef);
  if (poemSnap.exists()) {
    return { id: poemSnap.id, ...poemSnap.data() } as unknown as Poem;
  }
  return null;
};

export const getPoems = async (filter?: { mood?: string; authorId?: string; status?: "published" | "draft"; limit?: number; search?: string }) => {
  const status = filter?.status || "published";
  let q = query(collection(db, "poems"), where("status", "==", status), orderBy("createdAt", "desc"));
  
  if (filter?.mood) {
    q = query(q, where("moods", "array-contains", filter.mood));
  }
  
  if (filter?.authorId) {
    q = query(q, where("authorId", "==", filter.authorId));
  }
  
  if (filter?.limit) {
    q = query(q, limit(filter.limit));
  }
  
  const querySnapshot = await getDocs(q);
  let poems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Poem));

  if (filter?.search) {
    const searchLower = filter.search.toLowerCase();
    poems = poems.filter(p => 
      p.title.toLowerCase().includes(searchLower) || 
      p.authorName.toLowerCase().includes(searchLower)
    );
  }

  return poems;
};

export const likePoem = async (poemId: string, userId: string) => {
  const likeRef = doc(db, "poems", poemId, "likes", userId);
  const likeSnap = await getDoc(likeRef);
  
  if (likeSnap.exists()) return; // Déjà liké
  
  await setDoc(likeRef, {
    userId,
    createdAt: serverTimestamp(),
  });
  
  const poemRef = doc(db, "poems", poemId);
  await updateDoc(poemRef, {
    likesCount: increment(1)
  });
};

// --- Comments ---

export const addComment = async (poemId: string, commentData: Partial<Comment>) => {
  const commentRef = collection(db, "poems", poemId, "comments");
  await addDoc(commentRef, {
    ...commentData,
    createdAt: serverTimestamp(),
  });
  
  const poemRef = doc(db, "poems", poemId);
  await updateDoc(poemRef, {
    commentsCount: increment(1)
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

// --- Bookmarks (Recueil) ---

export const toggleBookmark = async (userId: string, poemId: string) => {
  const bookmarkRef = doc(db, "users", userId, "bookmarks", poemId);
  const bookmarkSnap = await getDoc(bookmarkRef);
  
  if (bookmarkSnap.exists()) {
    await deleteDoc(bookmarkRef);
    return false; // Retiré
  } else {
    await setDoc(bookmarkRef, {
      poemId,
      createdAt: serverTimestamp(),
    });
    return true; // Ajouté
  }
};

export const isBookmarked = async (userId: string, poemId: string) => {
  const bookmarkRef = doc(db, "users", userId, "bookmarks", poemId);
  const bookmarkSnap = await getDoc(bookmarkRef);
  return bookmarkSnap.exists();
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

// --- Follow System ---

export const followUser = async (followerId: string, followedId: string) => {
  const followRef = doc(db, "users", followedId, "followers", followerId);
  const followingRef = doc(db, "users", followerId, "following", followedId);
  
  await setDoc(followRef, { createdAt: serverTimestamp() });
  await setDoc(followingRef, { createdAt: serverTimestamp() });
};

export const unfollowUser = async (followerId: string, followedId: string) => {
  const followRef = doc(db, "users", followedId, "followers", followerId);
  const followingRef = doc(db, "users", followerId, "following", followedId);
  
  await deleteDoc(followRef);
  await deleteDoc(followingRef);
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
