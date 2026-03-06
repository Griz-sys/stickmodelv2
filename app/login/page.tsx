"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup") setMode("signup");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/signup";

      const body =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : formData;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Authentication failed");

      const user = data.user as { role?: string };

      if (user?.role === "admin") {
        router.push("/admin");
      } else {
        const redirect = searchParams.get("redirect") || "/home";
        router.push(redirect);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-white">
      {/* Header */}
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ff5a1f] flex items-center justify-center shadow-md shadow-orange-500/30">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>

            <span className="font-semibold text-lg text-slate-900">
              StickModel
            </span>
          </Link>

          <div className="w-20" />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-orange-100 rounded-2xl p-8 shadow-xl">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>

              <p className="text-slate-500 mt-2">
                {mode === "login"
                  ? "Login to access your projects"
                  : "Start building structural models faster"}
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 text-sm bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="John Doe"
                    className="mt-2 focus-visible:ring-orange-500"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="you@example.com"
                  className="mt-2 focus-visible:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="mt-2 focus-visible:ring-orange-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 rounded-xl text-white font-semibold
                bg-[#ff5a1f] hover:bg-[#ff6b2c]
                shadow-lg shadow-orange-500/30
                hover:shadow-orange-500/40
                transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-5 h-5" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Switch Mode */}
            <div className="text-center mt-6">
              <button
                onClick={toggleMode}
                disabled={isLoading}
                className="text-sm text-slate-600 hover:text-[#ff5a1f] font-medium transition"
              >
                {mode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            By continuing you agree to our Terms and Privacy Policy
          </p>
        </motion.div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
