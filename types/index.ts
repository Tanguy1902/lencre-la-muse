export interface User {
  uid: string;
  displayName: string;
  email: string;
  bio?: string;
  role?: string;
  photoURL?: string;
  publishedCount: number;
  readersCount: number;
  createdAt: string | number | Date;
}

export interface Poem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  moods: string[];
  collection?: string;
  visibility: "public" | "subscribers" | "private";
  status: "draft" | "published";
  likesCount: number;
  commentsCount: number;
  isPoemOfDay?: boolean;
  imageUrl?: string;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export interface Comment {
  id: string;
  poemId: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  createdAt: string | number | Date;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string | number | Date;
}
