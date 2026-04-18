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
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpValue, setOtpValue] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    website: "",
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
      if (mode === "login") {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Authentication failed");

        const user = data.user as { role?: string };

        if (user?.role === "admin") {
          router.push("/admin");
        } else {
          const redirect = searchParams.get("redirect") || "/home";
          router.push(redirect);
        }

        router.refresh();
      } else {
        if (step === "form") {
          // Step 1: send OTP to the user's email to verify it
          const response = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              companyName: formData.companyName,
              website: formData.website,
            }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Failed to send code");

          setStep("otp");
        } else {
          // Step 2: verify OTP and submit the invite request
          const response = await fetch("/api/auth/request-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, otp: otpValue }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Failed to send request");

          setFormData({ name: "", email: "", password: "", companyName: "", website: "" });
          setOtpValue("");
          setStep("form");
          setMode("login");
          alert("✓ Invite request sent! We'll review your request and contact you soon.");
        }
      }
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
    setStep("form");
    setOtpValue("");
    setFormData({ name: "", email: "", password: "", companyName: "", website: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-stone-50 to-white">
      {/* Header */}
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-[#E67E00] transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <img src="/horizontal.svg" alt="StickModel" className="h-8 w-auto" />
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
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-none p-8 shadow-xl">
            {/* Title */}
            <div className="text-center mb-8">
              {mode === "login" && (
                <div className="mb-6 p-4 bg-[#E67E00]/10 border border-[#E67E00]/30 rounded-none">
                  <p className="text-sm font-semibold text-[#E67E00]">
                    🔒 We are invite-only currently
                  </p>
                </div>
              )}
              <h1 className="text-3xl font-bold text-slate-900">
                {mode === "login" ? "Welcome Back" : step === "form" ? "Request an Invite" : "Verify Your Email"}
              </h1>

              <p className="text-slate-500 mt-2">
                {mode === "login"
                  ? "Login to access your projects"
                  : step === "form"
                  ? "Join us and start building structural models faster"
                  : "Enter the 6-digit code we sent to your inbox"}
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
              {mode === "login" ? (
                <>
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
                      className="mt-2 focus-visible:ring-[#E67E00]"
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
                      className="mt-2 focus-visible:ring-[#E67E00]"
                    />
                  </div>
                </>
              ) : step === "form" ? (
                <>
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
                      className="mt-2 focus-visible:ring-[#E67E00]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Company Name
                    </label>
                    <Input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      placeholder="Your Company"
                      className="mt-2 focus-visible:ring-[#E67E00]"
                    />
                  </div>

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
                      className="mt-2 focus-visible:ring-[#E67E00]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Website <span className="text-slate-400">(optional)</span>
                    </label>
                    <Input
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="https://yourcompany.com"
                      className="mt-2 focus-visible:ring-[#E67E00]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center p-4 bg-[#E67E00]/10 border border-[#E67E00]/30 rounded-none">
                    <p className="text-sm text-slate-700">
                      We sent a 6-digit code to{" "}
                      <strong>{formData.email}</strong>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Check your inbox (and spam folder)
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Verification Code
                    </label>
                    <Input
                      value={otpValue}
                      onChange={(e) =>
                        setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      required
                      disabled={isLoading}
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      className="mt-2 text-center text-2xl tracking-widest font-mono focus-visible:ring-[#E67E00]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setOtpValue("");
                      setError("");
                    }}
                    className="text-sm text-slate-500 hover:text-[#E67E00] transition text-center w-full"
                  >
                    ← Back / Resend code
                  </button>
                </>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 rounded-none text-white font-semibold
                bg-[#E67E00] hover:bg-[#d66c00]
                shadow-lg shadow-[#E67E00]/30
                hover:shadow-[#E67E00]/40
                transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-5 h-5" />
                    {mode === "login"
                      ? "Signing in..."
                      : step === "form"
                      ? "Sending code..."
                      : "Submitting..."}
                  </>
                ) : mode === "login" ? (
                  "Sign In"
                ) : step === "form" ? (
                  "Send Verification Code"
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>

            {/* Switch Mode */}
            <div className="text-center mt-6">
              <button
                onClick={toggleMode}
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-none font-semibold text-sm border-2 border-[#E67E00] text-[#E67E00] hover:bg-[#E67E00] hover:text-white transition-all"
              >
                {mode === "login"
                  ? "Don't have access? Request an invite"
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
          <Loader2 className="animate-spin w-8 h-8 text-[#E67E00]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
