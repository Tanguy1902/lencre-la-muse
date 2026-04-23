"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { createUserProfile } from "@/lib/firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Synchroniser le profil dans Firestore
          await createUserProfile(firebaseUser.uid, {
            displayName: firebaseUser.displayName || "Auteur anonyme",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL || "",
          });
        } catch (error) {
          console.error("Fahadisoana teo am-pampandrenesana ny mombamomba:", error);
        }
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
