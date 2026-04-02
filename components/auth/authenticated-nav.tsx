"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function AuthenticatedNav() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Don't show nav on public pages or pages with their own navbar
  const pagesWithoutNav = ["/", "/login", "/admin", "/home"];
  if (pagesWithoutNav.includes(pathname) || pathname.startsWith("/requests/")) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo - logs out and returns to landing */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.svg" alt="StickModel" className="h-11 w-auto" />
          <span className="font-semibold text-lg text-slate-900">
            stickmodel.com
          </span>
        </button>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/home"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
          >
            About
          </Link>
          <Link
            href="/pricing"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
          >
            Contact
          </Link>
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 hidden sm:block">
            Hi, {user.name}
          </span>
          <div className="relative group">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-medium shadow-sm cursor-pointer">
              {initial}
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
