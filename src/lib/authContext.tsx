"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  loginAsAdmin: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedAdminEmail = localStorage.getItem("adminEmail");
    if (storedAdminEmail) {
      setAdminEmail(storedAdminEmail);
      setIsAdmin(true);
    }
  }, []);

  const loginAsAdmin = (email: string, password: string): boolean => {
    // Check admin credentials
    if (email === "admin@gmail.com" && password === "admin123") {
      setIsAdmin(true);
      setAdminEmail(email);
      localStorage.setItem("adminEmail", email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminEmail(null);
    localStorage.removeItem("adminEmail");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, adminEmail, loginAsAdmin, logout }}>
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
