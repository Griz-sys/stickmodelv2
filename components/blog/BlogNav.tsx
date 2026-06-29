"use client";

import { useEffect, useState } from "react";
import { HeroNav } from "@/components/hero-nav";

/**
 * Shows HeroNav only when the visitor is NOT logged in.
 * Logged-in users already have AuthenticatedNav from the root layout.
 */
export function BlogNav() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsAuth(!!d.user))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth !== false) return null;
  return <HeroNav />;
}
