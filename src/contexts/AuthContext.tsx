import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
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
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              userId: currentUser.uid,
              email: currentUser.email || "",
              displayName: currentUser.displayName || "Patient",
              photoURL: currentUser.photoURL || "",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } else {
            await setDoc(
              userRef,
              {
                email: currentUser.email || "",
                displayName: currentUser.displayName || "Patient",
                photoURL: currentUser.photoURL || "",
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch (error) {
          console.error("Failed to sync user profile with Firestore:", error);
          // Non-blocking for auth state
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
