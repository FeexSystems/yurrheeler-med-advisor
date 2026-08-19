import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";

export interface StoredTriageSession {
  sessionId: string;
  userId: string;
  agentId: string;
  agentName: string;
  agentSpecialty: string;
  symptoms: string;
  status: "in_progress" | "completed";
  summaryDocument?: string;
  triageLevel?: "EMERGENCY" | "URGENT" | "SEMI-URGENT" | "NON-URGENT" | "ROUTINE";
  news2Score?: number;
  keyFindings?: string;
  recommendedNextSteps?: string;
  messagesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

const LOCAL_STORAGE_SESSIONS_KEY = "yurrheeler_guest_triage_sessions";

export async function saveTriageSession(session: StoredTriageSession): Promise<void> {
  const { userId, sessionId } = session;

  if (userId && userId !== "guest") {
    const sessionPath = `users/${userId}/sessions/${sessionId}`;
    try {
      const sessionRef = doc(db, "users", userId, "sessions", sessionId);
      await setDoc(
        sessionRef,
        {
          ...session,
          updatedAt: serverTimestamp(),
          createdAt: session.createdAt || serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, sessionPath);
    }
  } else {
    // Guest local storage persistence
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
      const list: StoredTriageSession[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((s) => s.sessionId === sessionId);
      const updated: StoredTriageSession = {
        ...session,
        updatedAt: new Date().toISOString(),
        createdAt: session.createdAt || new Date().toISOString(),
      };
      if (idx >= 0) {
        list[idx] = updated;
      } else {
        list.unshift(updated);
      }
      localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }
}

export async function getUserTriageSessions(userId: string | null): Promise<StoredTriageSession[]> {
  if (userId && userId !== "guest") {
    const sessionCollectionPath = `users/${userId}/sessions`;
    try {
      const sessionsRef = collection(db, "users", userId, "sessions");
      const q = query(sessionsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          sessionId: docSnap.id,
          userId: data.userId || userId,
          agentId: data.agentId || "yurrheeler",
          agentName: data.agentName || "Yurrheeler Medic",
          agentSpecialty: data.agentSpecialty || "General Medicine",
          symptoms: data.symptoms || "",
          status: data.status || "completed",
          summaryDocument: data.summaryDocument || "",
          triageLevel: data.triageLevel || "SEMI-URGENT",
          news2Score: data.news2Score || 0,
          keyFindings: data.keyFindings || "",
          recommendedNextSteps: data.recommendedNextSteps || "",
          messagesCount: data.messagesCount || 0,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (typeof data.createdAt === "string" ? data.createdAt : undefined),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (typeof data.updatedAt === "string" ? data.updatedAt : undefined),
        } as StoredTriageSession;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, sessionCollectionPath);
    }
  }

  // Fallback to local guest sessions
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function deleteTriageSession(userId: string | null, sessionId: string): Promise<void> {
  if (userId && userId !== "guest") {
    const sessionPath = `users/${userId}/sessions/${sessionId}`;
    try {
      const sessionRef = doc(db, "users", userId, "sessions", sessionId);
      await deleteDoc(sessionRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, sessionPath);
    }
  } else {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
      if (raw) {
        const list: StoredTriageSession[] = JSON.parse(raw);
        const filtered = list.filter((s) => s.sessionId !== sessionId);
        localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn("Could not delete from localStorage:", e);
    }
  }
}

export async function requestSessionSummary(payload: {
  history: Array<{ role: "user" | "model"; text: string }>;
  patientContext?: unknown;
  agentName: string;
  agentSpecialty: string;
}): Promise<{
  summaryDocument: string;
  triageLevel: "EMERGENCY" | "URGENT" | "SEMI-URGENT" | "ROUTINE";
  agentName: string;
  agentSpecialty: string;
  generatedAt: string;
}> {
  const res = await fetch("/api/generate-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to generate triage session summary.");
  }

  return await res.json();
}
