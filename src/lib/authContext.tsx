"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import authUsers from "@/data/temp-users.json";

type AuthRole = "admin" | "user";

type AuthRecord = {
  email: string;
  password: string;
  role: AuthRole;
};

interface AuthContextType {
  isAdmin: boolean;
  isUser: boolean;
  adminEmail: string | null;
  userEmail: string | null;
  currentRole: AuthRole | null;
  loginAsAdmin: (email: string, password: string) => boolean;
  loginAsUser: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_USERS = authUsers as AuthRecord[];
const AUTH_EMAIL_KEY = "authEmail";
const AUTH_ROLE_KEY = "authRole";

function findAuthRecord(email: string, password: string, role: AuthRole) {
  return AUTH_USERS.find(
    (user) => user.email === email && user.password === password && user.role === role,
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<AuthRole | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);
    const storedRole = localStorage.getItem(AUTH_ROLE_KEY) as AuthRole | null;

    if (storedEmail && (storedRole === "admin" || storedRole === "user")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentEmail(storedEmail);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentRole(storedRole);
    }
  }, []);

  const persistSession = (email: string, role: AuthRole) => {
    setCurrentEmail(email);
    setCurrentRole(role);
    localStorage.setItem(AUTH_EMAIL_KEY, email);
    localStorage.setItem(AUTH_ROLE_KEY, role);
  };

  const loginAsAdmin = (email: string, password: string): boolean => {
    const record = findAuthRecord(email, password, "admin");
    if (!record) return false;
    persistSession(record.email, record.role);
    return true;
  };

  const loginAsUser = (email: string, password: string): boolean => {
    const record = findAuthRecord(email, password, "user");
    if (!record) return false;
    persistSession(record.email, record.role);
    return true;
  };

  const logout = () => {
    setCurrentEmail(null);
    setCurrentRole(null);
    localStorage.removeItem(AUTH_EMAIL_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin: currentRole === "admin",
        isUser: currentRole === "user",
        adminEmail: currentRole === "admin" ? currentEmail : null,
        userEmail: currentRole === "user" ? currentEmail : null,
        currentRole,
        loginAsAdmin,
        loginAsUser,
        logout,
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
