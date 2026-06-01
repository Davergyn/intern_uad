"use client";

import { useEffect, useState } from "react";

const PROFILE_NAME_KEY_PREFIX = "profile_name_";

/**
 * Hook to read a user's display name from localStorage.
 * Falls back to the email prefix (before @) if no name is stored.
 *
 * @param email - The user's email address (null if not mounted/authenticated)
 * @param deps  - Optional extra dependencies to re-read from localStorage
 */
export function useProfileName(
  email: string | null | undefined,
  deps: unknown[] = [],
): string {
  const [name, setName] = useState("User");

  useEffect(() => {
    if (!email) {
      setName("User");
      return;
    }

    // Try to read stored profile name
    const stored = localStorage.getItem(`${PROFILE_NAME_KEY_PREFIX}${email}`);
    if (stored && stored.trim()) {
      setName(stored.trim());
    } else {
      // Fallback: extract name from email prefix
      const prefix = email.split("@")[0] ?? "User";
      // Capitalise first letter
      setName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, ...deps]);

  return name;
}
