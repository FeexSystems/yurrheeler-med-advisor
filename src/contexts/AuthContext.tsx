import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDocFromServer, serverTimestamp } from "firebase/firestore";
import { auth, db, signInWithGoogle, logOut, handleFirestoreError, OperationType } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => { throw new Error("AuthContext not initialized"); },
  logout: async () => { throw new Error("AuthContext not initialized"); },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Sync user profile document to Firestore when signed in
      if (currentUser) {
        const userDocPath = `users/${currentUser.uid}`;
        try {
          const userRef = doc(db, "users", currentUser.uid);
          await setDoc(
            userRef,
            {
              userId: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "Patient",
              photoURL: currentUser.photoURL || "",
              lastLoginAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (error) {
          if (error instanceof Error && error.message.includes("offline")) {
             console.warn("Profile sync deferred: Client is offline");
          } else {
             console.error("Failed to sync user profile with Firestore:", error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const loggedInUser = await signInWithGoogle();
      return loggedInUser;
    } catch (err) {
      console.error("Authentication error during login:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Error during sign out:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
