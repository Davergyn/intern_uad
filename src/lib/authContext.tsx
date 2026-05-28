"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AuthRole = "admin" | "user";

// Local user type (replacement for Supabase User)
interface LocalUser {
  id?: string;
  email: string;
  role: AuthRole;
}

interface AuthContextType {
  // Local auth state
  user: LocalUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  // Legacy auth state (backward compatibility)
  isAdmin: boolean;
  isUser: boolean;
  adminEmail: string | null;
  userEmail: string | null;
  currentRole: AuthRole | null;

  // Auth methods (placeholder - implement with server routes later)
  loginAsAdmin: (email: string, password: string) => boolean;
  loginAsUser: (email: string, password: string) => boolean;
  logout: () => void;

  // Future server-based auth methods
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: any; user: LocalUser | null }>;
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ error: any; user: LocalUser | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_EMAIL_KEY = "authEmail";
const AUTH_ROLE_KEY = "authRole";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Local auth state (placeholder)
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(false);

  // Legacy auth state
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<AuthRole | null>(null);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);
    const storedRole = localStorage.getItem(AUTH_ROLE_KEY) as AuthRole | null;

    if (storedEmail && (storedRole === "admin" || storedRole === "user")) {
      setCurrentEmail(storedEmail);
      setCurrentRole(storedRole);
      // Set local user state
      setUser({
        email: storedEmail,
        role: storedRole,
      });
    }
    setLoading(false);
  }, []);

  const persistSession = (email: string, role: AuthRole) => {
    setCurrentEmail(email);
    setCurrentRole(role);
    localStorage.setItem(AUTH_EMAIL_KEY, email);
    localStorage.setItem(AUTH_ROLE_KEY, role);
    setUser({
      email,
      role,
    });
  };

  const loginAsAdmin = (email: string, password: string): boolean => {
    // Placeholder: implement with server route later
    if (!email || !password) return false;
    persistSession(email, "admin");
    return true;
  };

  const loginAsUser = (email: string, password: string): boolean => {
    // Placeholder: implement with server route later
    if (!email || !password) return false;
    persistSession(email, "user");
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentEmail(null);
    setCurrentRole(null);
    localStorage.removeItem(AUTH_EMAIL_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
  };

  // Future: Replace with server-based auth methods
  const signUp = async (email: string, password: string) => {
    try {
      // TODO: Implement with server route when ready
      console.warn("signUp: Not yet implemented - awaiting server route setup");
      return { error: null, user: null };
    } catch (error) {
      return { error, user: null };
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    try {
      // TODO: Implement with server route when ready
      console.warn(
        "signInWithPassword: Not yet implemented - awaiting server route setup",
      );
      return { error: null, user: null };
    } catch (error) {
      return { error, user: null };
    }
  };

  const signOut = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        // Local state
        user,
        loading,
        isAuthenticated: !!user,

        // Legacy state
        isAdmin: currentRole === "admin",
        isUser: currentRole === "user",
        adminEmail: currentRole === "admin" ? currentEmail : null,
        userEmail: currentRole === "user" ? currentEmail : null,
        currentRole,

        // Auth methods
        loginAsAdmin,
        loginAsUser,
        logout,
        signUp,
        signInWithPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
